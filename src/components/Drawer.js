import React from "react";
import "./Drawer.css";

export default function Drawer({ isOpen, onClose, children }) {
  return (
    <div className={`drawer-overlay ${isOpen ? "open" : ""}`}>
      <div className="drawer-panel">
        <button className="drawer-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
