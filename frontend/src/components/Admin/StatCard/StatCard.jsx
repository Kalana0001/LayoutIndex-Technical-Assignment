import React from "react";

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

export default StatCard;
