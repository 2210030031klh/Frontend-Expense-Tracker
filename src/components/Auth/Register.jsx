import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import './Register.css'
import {toast } from 'react-toastify'

const Register = () => {
    const[loading, setLoading]=useState(false)
    const[userName, setUserName] = useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const navigate= useNavigate()

    const submitHandler = async (e)=>{
        e.preventDefault()
        if(!email||!userName||!password)
        {
            toast.error("All fields are required")
            return
        }
        if (userName.length < 3) {
            toast.error("Username must be at least 3 characters")
            return
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            toast.error("Password must include a number and uppercase letter")
            return
        }
        if(loading) return
        setLoading(true)
        
        try{
            const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/Auth/register`,
                {
                    username:userName,
                    email:email,
                    password:password
                }
            )
            if(response.status===200|| response.status===201){            
                console.log("Registration Successful",response.data)
                
                setTimeout(()=>{
                    navigate('/login')
                },1500)
                
                toast.success("Account successfully created")}
                setUserName('')
                setPassword('')
                setEmail('')
            }
            catch(error)
            {
                
            if (!error.response) {
                toast.error("Server not reachable. Try again later.")
                return
            }

            console.error("Registration Failed",error.message)
            const errorMessage = error.response?.data?.message||
                                 error.response?.data||
                                 "Registration failed" 
            toast.error(errorMessage)
        }
        finally{
            setLoading(false)
        }
    }


  return (
    <div className='login-container'>
        <div className='login-box'>
            <form onSubmit={(e)=>
                {
                    submitHandler(e)
                }
            }
            
            className='login-form' >
                            <h2 className="login-title">Welcome</h2>   
            <p className="login-subtitle">Sign up to manage your expenses</p>
            {/* <p>Username:</p> */}
                <input value={userName}
                onChange={(e)=> 
                {
                    setUserName(e.target.value)
                }} 
                required className='input-field' type='text' placeholder='Enter your username'>
                </input>
                <br />

                {/* <p>Email:</p> */}
                <input value={email}
                onChange={(e)=>
                {
                    setEmail(e.target.value)
                }}
                required
                className='input-field' type='email' placeholder='Enter your email'>
                </input>
                <br/>
                {/* <p>Password:</p> */}
                <input value={password}
                onChange={(e)=>
                {
                    setPassword(e.target.value)
                }}
                required
                className='input-field' type='password' placeholder='Enter your password'>
                </input>

                <p className='login-text'>Already have an account?
                    <span onClick={()=>navigate('/login')} className='login-link'> Sign in</span>
                </p>

                <button className='register-button' disabled={loading}>
                    {loading? "Registering..":"Register"}
                </button>

            </form>

        </div>
    </div>
  )
}

export default Register