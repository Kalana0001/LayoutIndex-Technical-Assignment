import React from "react";
import { LogOut, Bell } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      await axios.post("http://localhost:8180/api/logout");
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="top-bar">
      <input
        type="text"
        placeholder="Search products, categories..."
        className="search-input"
      />
      <div className="top-bar-actions">
        <div className="icon clickable notification">
          <Bell />
          <span className="dot"></span>
        </div>
        <div
          className="profile clickable"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <LogOut className="icon-sm" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
