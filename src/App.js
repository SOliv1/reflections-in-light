import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppShell from "./components/AppShell";
import MiniOrbMenu from "./components/MiniOrbMenu";

import "./App.css";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTestLogo, setShowTestLogo] = useState(false);
  const [testSeason, setTestSeason] = useState(null);
  const [showR, setShowR] = useState(false);

  return (
    <Router>
        {/* Mini Orb Controls */}
      <MiniOrbMenu
        testSeason={testSeason}
        setTestSeason={setTestSeason}
        showTestLogo={showTestLogo}
        setShowTestLogo={setShowTestLogo}
        showR={showR}
        setShowR={setShowR}
      />


      {/* Main App */}
      <AppShell
        testSeason={testSeason}
        showTestLogo={showTestLogo}
        showR={showR}
      />

    </Router>
  );
}
