import React,{useState, useEffect} from 'react'
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import './VerifyOtp.css'

const VerifyOtp = () => {
    const[otp,setOtp]=useState('')
    const[loading,setLoading]=useState(false)

    const location = useLocation()
    const navigate =useNavigate()

    const username =location.state?.username
    useEffect(()=>
    {
        if(!username)
        {
            toast.error("Unauthorized access")
            navigate('/login')
        }
    },[username,navigate])
    
    const handleVerify=async (e)=>
    {
        e.preventDefault()
        if(loading) return

        setLoading(true)

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Auth/verify-otp`,
                {
                    username: username,
                    otp: otp
                }
            )
            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("refreshToken",response.data.refreshToken)
            localStorage.setItem("userId", response.data.userId);

            toast.success("Login Successful")

            navigate('/home')
        }
        catch(error){
            if(!error.response)
            {
                toast.error("Server not responding")
                return
            }
            toast.error("Invalid or expired OTP")
        }
        finally{
            setLoading(false)
        }
    }
    
  return (
    <div className="login-container">
        <div className='login-box'>
            <form onSubmit={handleVerify} className='login-form'>
                <h2> Verify OTP</h2>
                <p>Enter the OTP sent to your email</p>

                <input value={otp}
                onChange={(e)=> setOtp(e.target.value)}
                className="input-field"
                placeholder="Enter OTP"
                required>

                </input>
                <button disabled={loading}>{loading?"Verifying..":"Verify OTP"}</button>

            </form>
        </div>
    </div>
  )
}

export default VerifyOtp