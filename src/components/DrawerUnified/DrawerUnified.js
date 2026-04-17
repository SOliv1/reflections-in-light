import React, { useState } from "react";
import "./DrawerUnified.css";
import Tabs from "./Tabs/Tabs";
import ReflectionsPanel from "./Panels/ReflectionsPanel";
import ActionsPanel from "./Panels/ActionsPanel";
import NotesPanel from "./Panels/NotesPanel";
import QuotePanel from "./Panels/QuotePanel";

export default function DrawerUnified({ isOpen, onClose, season, mood }) {
  const [activeTab, setActiveTab] = useState("reflections");

  return (
    <div className={`drawer-unified ${isOpen ? "open" : ""}`}>
      <div className="drawer-backdrop" onClick={onClose} />

      <div className={`drawer-surface season-${season} mood-${mood}`}>
        <button className="drawer-close" onClick={onClose}>×</button>

        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="drawer-content fade-in">
          {activeTab === "reflections" && <ReflectionsPanel />}
          {activeTab === "actions" && <ActionsPanel />}
          {activeTab === "notes" && <NotesPanel />}
          {activeTab === "quote" && <QuotePanel season={season} />}
        </div>
      </div>
    </div>
    
  );
}

