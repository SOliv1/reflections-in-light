import React from "react";
import "./Tabs.css";

export default function Tabs({ activeTab, onChange }) {
  const tabs = [
    { id: "reflections", label: "Short Reflections" },
    { id: "actions", label: "Quiet Actions" },
    { id: "notes", label: "Light Notes" },
    { id: "quote", label: "Quote of the Day" }
  ];

  return (
    <div className="tabs-container">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
