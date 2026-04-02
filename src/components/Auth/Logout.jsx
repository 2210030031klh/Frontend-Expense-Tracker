import React,{useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

const Logout = () => {
    const navigate= useNavigate();

    useEffect(()=>{
        //remove tokens from local storage
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate('/login')
        toast.success("Logged out successfully")

    },[])
  return (
    <div>Logging out..</div>
  )
}

export default Logout