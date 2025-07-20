import React from "react";
import {
  LayoutDashboard,
  Boxes,
  Tag,
  User
} from "lucide-react";
import "./AdminSidebar.css";

const NavItem = ({ icon, label, active, onClick }) => (
  <div className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
    <div className="icon-sm">{icon}</div>
    <span>{label}</span>
  </div>
);

const AdminSidebar = ({ activeTab, setActiveTab }) => (
  <aside className="sidebar">
    <div className="logo">
      <span className="admin-label">
        <User className="admin-icon" />
        <span>Admin</span>
        <br />
      </span>
      <span className="subtitle">E-Commerce</span>
    </div>
    <nav className="nav-menu">
      <NavItem
        icon={<LayoutDashboard />}
        label="Dashboard"
        active={activeTab === "Dashboard"}
        onClick={() => setActiveTab("Dashboard")}
      />
      <NavItem
        icon={<Tag />}
        label="Categories"
        active={activeTab === "Categories"}
        onClick={() => setActiveTab("Categories")}
      />
      <NavItem
        icon={<Boxes />}
        label="Products"
        active={activeTab === "Products"}
        onClick={() => setActiveTab("Products")}
      />
    </nav>
  </aside>
);

export default AdminSidebar;
