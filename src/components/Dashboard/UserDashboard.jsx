import React,{useState, useEffect} from 'react'
import axios from 'axios';
import './UserDashboard.css';
import DashboardCards from './DashboardCards';
import UserCharts from './UserCharts';

const UserDashboard = () => {
  const[username, setUsername] = useState('');
  const[recentExpenses, setRecentExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const[loading, setLoading] = useState(true);

  const Expense_API_URL = `${import.meta.env.VITE_API_URL}/api/Expense`;
  const User_API_URL = `${import.meta.env.VITE_API_URL}/api/User/profile`;
  const Dashboard_API_URL = `${import.meta.env.VITE_API_URL}/api/Dashboard/summary`;

  const getAuthConfig=()=>{
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUsername = async () => {
    try{
      const result = await axios.get(User_API_URL, getAuthConfig());
      setUsername(result.data.username || 'User');
    }
    catch(error){
      console.error('Error fetching user profile:', error);
      setUsername('User');
    }
  };

  
  const fetchUserRecentExpenses = async () => {
    try{
      const result= await axios.get(`${Expense_API_URL}?pageNumber=1&pageSize=10`, getAuthConfig());
      setRecentExpenses(result.data.items||[]);
    }
    catch(error){
      console.error('Error fetching recent expenses:', error);
      setRecentExpenses([]);
    }
    finally{
      setLoading(false);
    }
  };

  const fetchDashboardSummary = async () => {
  try {
    const result = await axios.get(Dashboard_API_URL, getAuthConfig());
    setSummary(result.data);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    setSummary(null);
  }
};
  
  useEffect(() => {
    fetchUsername();
    fetchUserRecentExpenses();
    fetchDashboardSummary();
  }, []);
  return (
    <div className='userdashboard-page'>
      <h1 className='User-greetings'>Hello {username}</h1>

      <DashboardCards summary={summary} />
      <UserCharts />

      <div className="userdashboard-table">
        <h2 className='userdashboard-title'>Recent Expenses</h2>
        <div className="userdashboard-table-container"> 
      <table className='Recent-Expenses'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th> 
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
            {recentExpenses.length === 0 ? (
              <tr>
                  <td colSpan="6" className="expenses-empty">
                        No expenses found
                  </td>
              </tr>
                  ) : (
          recentExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.name}</td>
              <td><span>{expense.categoryName}</span></td>
              <td>₹{expense.amount}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description}</td>
            </tr>
          ))
        )}
        </tbody>
      </table>
      </div>
      </div>

    </div>
  )
}

export default UserDashboard