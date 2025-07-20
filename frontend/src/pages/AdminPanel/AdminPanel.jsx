import React, { useState } from "react";
import "./AdminPanel.css";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader/AdminHeader";
import AdminPanelCard from "../../components/Admin/AdminPanelCard/AdminPanelCard";
import ProductPage from "../ProductPage/ProductPage";
import AddNewProductPage from "../AddNewProductPage/AddNewProductPage";
import CategoriesPage from "../CategoriesPage/CategoriesPage";
import EditProductPage from "../EditProductPage/EditProductPage";


const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [productToEdit, setProductToEdit] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <AdminPanelCard setActiveTab={setActiveTab} />;
      case "Products":
        return <ProductPage setActiveTab={setActiveTab} setProductToEdit={setProductToEdit}/>;
      case "Add New Product":
        return <AddNewProductPage setActiveTab={setActiveTab} />;
      case "Categories":
        return <CategoriesPage />;
      case "Edit Product":
        return <EditProductPage setActiveTab={setActiveTab} productToEdit={productToEdit}/>;
      default:
        return <AdminPanelCard />;
    }
  };

  return (
    <div className="dashboard-container">
      <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="main-content">
        <AdminHeader />
        <div className="adminpanel-title">
          <h1 className="heading">{activeTab}</h1>
          <p className="subheading">Welcome back! Here's what's happening with your store.</p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;
