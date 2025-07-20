// src/components/AdminPanel/AdminPanelCard.jsx
import React, { useEffect, useState } from "react";
import { Boxes, Tag, DollarSign, AlertTriangle } from "lucide-react";
import axios from "axios";
import StatCard from "./StatCard";
import QuickAction from "./QuickAction";

const AdminPanelCard = ({ setActiveTab }) => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [categoryRes, productRes, lowCountRes, revenueRes] = await Promise.all([
          axios.get("http://localhost:8180/api/categories/count"),
          axios.get("http://localhost:8180/api/products/count"),
          axios.get("http://localhost:8180/api/products/lowcount"),
          axios.get("http://localhost:8180/api/products/totalprice"),
        ]);

        setCategoryCount(categoryRes.data.count);
        setProductCount(productRes.data.totalCount ?? productRes.data.count ?? 0);
        setLowStockCount(lowCountRes.data.lowQuantityCount ?? 0);

        const total = parseFloat(revenueRes.data.totalPrice);
        setRevenue(isNaN(total) ? 0 : total);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="stats-cards">
        <StatCard
          icon={<Boxes />}
          label="Total Products"
          value={productCount}
          change="+12% from last month"
        />
        <StatCard
          icon={<Tag />}
          label="Categories"
          value={categoryCount}
          change="+2 new categories"
        />
        <StatCard
          icon={<DollarSign />}
          label="Revenue"
          value={`$${revenue.toFixed(2)}`}
          change="+8.5% from last month"
        />
        <StatCard
          icon={<AlertTriangle />}
          label="Low Stock"
          value={lowStockCount}
          change="Needs attention"
          red
        />
      </div>

      <div className="quick-actions-wrapper">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <div className="quick-actions">
          <QuickAction
            icon={<Tag />}
            label="Manage Categories"
            desc="Organize product categories"
            color="action-green"
            onClick={() => setActiveTab("Categories")}
          />
          <QuickAction
            icon={<Boxes />}
            label="Add New Product"
            desc="Create a new product listing"
            color="action-blue"
            onClick={() => setActiveTab("Add New Product")}
          />
          <QuickAction
            icon={<DollarSign />}
            label="View Orders"
            desc="Check recent orders"
            color="action-yellow"
            onClick={() => alert("View Orders clicked (implement as needed)")}
          />
        </div>
      </div>
    </>
  );
};

export default AdminPanelCard;
