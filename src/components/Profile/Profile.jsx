import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/User/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (error) {
        if (!error.response) {
          console.error("Server not responding");
        } else if (error.response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        } else {
          console.error("Error:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!user) return <div className="profile-empty">No user data available</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-banner">
          <div className="profile-banner-left">
            <div className="profile-avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-user-info">
              <h2 className="profile-name">{user.username}</h2>
              <span className="profile-role-badge">{user.role}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-grid">
          <div className="profile-card">
            <h3 className="profile-card-title">Account Information</h3>

            <div className="profile-info-group">
              <span className="profile-label">Email</span>
              <p className="profile-value">{user.email}</p>
            </div>

            <div className="profile-info-group">
              <span className="profile-label">Role</span>
              <p className="profile-value">{user.role}</p>
            </div>
          </div>

          <div className="profile-card">
            <h3 className="profile-card-title">Security</h3>

            <p className="profile-security-text">
              Keep your account secure by updating your password regularly.
            </p>

            <button
              className="profile-btn profile-btn-danger"
              onClick={() => navigate("/ResetPassword")}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;