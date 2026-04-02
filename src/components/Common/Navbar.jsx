import React,{useState,useRef,useEffect} from "react";
import './Navbar.css'
import {NavLink} from 'react-router-dom'
import { useNavigate } from "react-router-dom";


export default function Navbar()
{
    const[open,setOpen]=useState(false);
    const profileRef = useRef();
    const navigate=useNavigate();

    useEffect(()=>
    {
        const handleClickOutside =(e)=>
        {
            if(profileRef.current && !profileRef.current.contains(e.target))
            {
                setOpen(false);
            }
        };
        document.addEventListener("click",handleClickOutside);
        return()=> document.removeEventListener("click",handleClickOutside);
    },[]);

    return (
    <nav className="navbar">

        <h2 className="logo" onClick={()=>navigate('/home')}>ExpenseTracker</h2>


        <div className="navbar-links">
        <NavLink  to="/Home" 
        className={(({isActive})=>(isActive?"active-link":""))}>
        Home
        </NavLink> 

        <NavLink  to="/UserDashboard"
        className={(({isActive})=>(isActive?"active-link":""))}>
        Dashboard
        </NavLink>


        <NavLink  to="/Income"
        className={(({isActive})=>(isActive?"active-link":""))}>
        Income
        </NavLink>


        <NavLink  to="/Expenses"
        className={(({isActive})=>(isActive?"active-link":""))}>
        Expenses
        </NavLink>


        <NavLink  to="/Budget"
        className={(({isActive})=>(isActive?"active-link":""))}>
        Budget
        </NavLink>
        </div>


        <div className="profile-menu" ref={profileRef} >
            <span onClick={()=>setOpen(!open)}>
        Profile </span>
        {open&&(
            <div className="dropdown-profile" onClick={(e) => e.stopPropagation()} 
            >
                <NavLink to="/Profile" className={(({isActive})=>(isActive?"active-link":""))}>My Profile</NavLink>
                <NavLink to="/Categories" className={(({isActive})=>(isActive?"active-link":""))}>Categories</NavLink>
                <NavLink to="/Logout" 
                className={(({isActive})=>(isActive?"active-link":""))}>
                Logout
                </NavLink>
                </div>
        )}
            </div>


    </nav>

    );
}