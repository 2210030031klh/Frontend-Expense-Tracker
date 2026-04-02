import React from 'react'
import './App.css'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import UserDashboard from './components/Dashboard/UserDashboard'
import {Routes, Route} from 'react-router-dom'
import Layout from './components/Common/Layout'
import Home from './components/Common/Home'
import Logout from './components/Auth/Logout'
import Category from './components/Category/Category'
import Profile from './components/Profile/Profile'
import Income from './components/Income/Income'
import Expense from './components/Expenses/Expense'
import Budget from "./components/Budget/Budget"
import ForgotPassword from './components/Auth/ForgotPassword'
import LandingPage from './components/Common/LandingPage'
import VerifyOtp from './components/Auth/VerifyOtp'
import ResetPassword from './components/Profile/ResetPassword'
import UpdateExpense from './components/Expenses/UpdateExpense'
import AddExpense from './components/Expenses/AddExpense'
import AddIncome from './components/Income/AddIncome'
import UpdateIncome from './components/Income/UpdateIncome'



const App = () => {
  return (
    <>

   <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path="/Forgotpassword" element ={<ForgotPassword/>}/>
    <Route path="/verify-otp" element={<VerifyOtp/>}/>

    <Route element={<Layout/>}> 
    <Route path='/home' element={<Home/>}/>
    <Route path='/UserDashboard' element = {<UserDashboard/>}/>
    <Route path='/Logout' element={<Logout/>}/>
    <Route path="/Categories" element={<Category/>}/>
    <Route path="/Profile" element={<Profile/>}/>
    <Route path="/Logout" element={<Logout/>}/>
    <Route path="/Income" element={<Income/>}/>
    <Route path="/Expenses" element={<Expense/>}/>
    <Route path="/Budget" element={<Budget/>}/>
    <Route path='/ResetPassword' element={<ResetPassword/>}/>
    <Route path='/UpdateExpense' element={<UpdateExpense/>}/>
    <Route path="/AddExpense" element={<AddExpense/>}/>
    <Route path="/AddIncome" element={<AddIncome/>}/>
    <Route path="/UpdateIncome" element={<UpdateIncome/>}/>


    </Route>

   </Routes>
   </>
  )
}

export default App