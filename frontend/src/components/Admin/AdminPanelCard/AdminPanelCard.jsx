import React, { useEffect, useState } from "react";
import { Boxes, Tag, DollarSign, AlertTriangle } from "lucide-react";
import axios from "axios";

const StatCard = ({ icon, label, value, change, red }) => (
  <div className="stat-card">
    <div>
      <h3 className="stat-label">{label}</h3>
      <p className="stat-value">{value}</p>
      <p className={`stat-change ${red ? "red" : "green"}`}>{change}</p>
    </div>
    <div className="stat-icon">{icon}</div>
  </div>
);

const QuickAction = ({ icon, label, desc, color, onClick }) => (
  <div className={`quick-action ${color}`} onClick={onClick} style={{ cursor: "pointer" }}>
    <div className="quick-action-icon">{icon}</div>
    <div>
      <h4 className="quick-action-label">{label}</h4>
      <p className="quick-action-desc">{desc}</p>
    </div>
  </div>
);

const AdminPanelCard = ({ setActiveTab }) => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get("http://localhost:8180/api/categories/count"),
          axios.get("http://localhost:8180/api/products/count"),
        ]);
        setCategoryCount(categoryRes.data.count);
        setProductCount(productRes.data.count);
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
          value="$15,680.5"
          change="+8.5% from last month"
        />
        <StatCard
          icon={<AlertTriangle />}
          label="Low Stock"
          value="2"
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
