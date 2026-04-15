import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    toast.success("Logged out successfully");

    navigate("/login", { replace: true }); 
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;