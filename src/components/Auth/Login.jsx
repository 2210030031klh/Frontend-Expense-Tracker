import React,{useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './Login.css'
import {toast} from 'react-toastify'
import{FaEye, FaEyeSlash} from 'react-icons/fa'


const Login = () => {
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate= useNavigate()

    useEffect(()=>
    {
        const token= localStorage.getItem("accesstoken")
        if(token)
        {
            navigate('/UserDashboard')
        }
    },[])

    const submitHandler= async (e)=>{
        e.preventDefault()
        if(loading) return

        setLoading(true)

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Auth/login`,
                {
                    username: userName,
                    password: password
                }
            )
            toast.success("OTP sent to your email")
            navigate('/verify-otp',{state:{username: userName}})
            setUserName('')
            setPassword('')
        }
        catch(error)
        {
        if (!error.response) {
            toast.error("Server not reachable")
            return
        }
        if (error.response.status === 401) {
            toast.error("Invalid username or password")
        }
        else {
            toast.error("Login failed")
        }
            console.error("Login Failed" ,error.response?.data||error.message)

        }
        finally{
            setLoading(false)
        }
    }


  return (
    <div className='login-container'>
        <div className='login-box'>
            <form onSubmit={(e)=>{
                    submitHandler(e)
                }
            }
            className='login-form'>
            <h2 className="login-title">Welcome Back</h2>   
            <p className="login-subtitle">Login to manage your expenses</p>
                <input value={userName}
                onChange={(e)=>
                {
                    setUserName(e.target.value)
                }}
                required 
                className='input-field' type="text" placeholder='Enter your username'>
                </input>

                <div className="password-wrapper">

                <input
                value={password}
                onChange={(e)=>
                    setPassword(e.target.value)
                }
                required className='input-field password-input'type={showPassword?"text":"password"} placeholder='Enter your password'>
                </input>
                <span className='eye-icon' onClick={()=> setShowPassword(!showPassword)}>
                    {showPassword?<FaEyeSlash/>:<FaEye/>}

                </span>

                    </div>
                
                <p className='login-forgot-password' onClick={() => navigate("/Forgotpassword")}>
                Forgot Password?
                </p>

                <button className='login-button' disabled={loading}>
                    {loading?"Logging in":"Log in"}
                </button>

                <p className="register-text">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")} 
                    className='register-link'>
                    Register</span> 
                </p>
            </form>
        </div>
    </div>
  )
}

export default Login