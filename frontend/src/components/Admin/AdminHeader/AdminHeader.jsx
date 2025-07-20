import React from "react";
import { Moon, Bell, UserPlus } from "lucide-react";

const AdminHeader = () => (
  <div className="top-bar">
    <input type="text" placeholder="Search products, categories..." className="search-input" />
    <div className="top-bar-actions">
      <div className="icon clickable notification">
        <Bell />
        <span className="dot"></span>
      </div>
      <div className="profile">
        <UserPlus className="icon-sm" />
        <span>Admin</span>
      </div>
    </div>
  </div>
);

export default AdminHeader;
