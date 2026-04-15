import React,{useState, useEffect}  from 'react'
import axios from 'axios';
import{ Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
}from 'chart.js'
import "./UserCharts.css"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

const UserCharts = () => {
  const[categoryData, setCategoryData] = useState([]);
  const[monthlyData, setMonthlyData] = useState([]);
  const[loading, setLoading] = useState(true);

  const CATEGORY_REPORT_API = `${import.meta.env.VITE_API_URL}/api/Expense/report/category`;
  const MONTHLY_REPORT_API = `${import.meta.env.VITE_API_URL}/api/Expense/report/monthly`;

  const getAuthConfig=()=>{
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      },
    };
  };

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#a855f7",
    "#14b8a6",
    "#f97316",
  ];

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formatCurrency=(value)=>`₹${Number(value).toLocaleString()}`;

  const fetchCategoryData = async () => {
    try{
      const[categoryRes, monthlyRes] = await Promise.all([
        axios.get(CATEGORY_REPORT_API, getAuthConfig()),
        axios.get(MONTHLY_REPORT_API, getAuthConfig()),
      ]);

      const formattedCategoryData = (categoryRes.data||[]).map((item) => ({
        name: item.categoryName,
        value: item.totalAmount,
        count: item.totalExpenses,
      }));
      const formattedMonthlyData = (monthlyRes.data||[]).map((item) => ({
        month: `${monthNames[item.month - 1]} ${item.year}`,
        amount: item.totalAmount,
        count: item.totalExpenses,
      }));

      setCategoryData(formattedCategoryData);
      setMonthlyData(formattedMonthlyData);
    }catch(error){
      console.error("Error fetching chart data:", error);
      setCategoryData([]);
      setMonthlyData([]);
    }finally{
      setLoading(false);
    }};

    useEffect(() => {
      fetchCategoryData();
    }, []);

    const pieData = {
      labels: categoryData.map((item) => item.name),
      datasets: [
        {
          data: categoryData.map((item) => item.value),
          backgroundColor: COLORS.slice(0, categoryData.length),
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };

    const pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 14,
            padding: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: function(context){
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${formatCurrency(value)}`;
            },
          },
        },
      },
    };

    const lineData = {
      labels: monthlyData.map((item) => item.month),
      datasets: [
        {
          label: "Expenses",
          data: monthlyData.map((item) => item.amount),
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.5)",
          tension: 0.4,
          fill: false,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#6366f1",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    const lineOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function(context){
              return `Expenses: ${formatCurrency(context.raw)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value){
              return `₹${Number(value).toLocaleString()}`;
            },
          },
        },
      },
    };
    if(loading){
      return <p className='usercharts-loading'>Loading charts...</p>;
    }

  return (
    <div className="usercharts-wrapper">
      <div className="usercharts-grid">
        <div className="usercharts-card">
          <h3 className="usercharts-title">Expense Breakdown (This Month)</h3>

          {categoryData.length === 0 ? (
            <p className="usercharts-empty">No expense data for this month</p>
          ) : (
            <div className="usercharts-pie-container">
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </div>

        <div className="usercharts-card">
          <h3 className="usercharts-title">Monthly Expenses Trend</h3>

          {monthlyData.length === 0 ? (
            <p className="usercharts-empty">No monthly expense data available</p>
          ) : (
            <div className="usercharts-line-container">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </div>
      </div>2
    </div>
  );
};

export default UserCharts;