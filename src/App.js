import { useState, useEffect } from "react";
import Constellation from "./components/Constellation";
import Calendar from "./components/Calendar";
import "./App.css";
import logo from "./assets/logo.png";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Day01 from "./pages/Day01";
import Day02 from "./pages/Day02";
import Day03 from "./pages/Day03";
import Day04 from "./pages/Day04";
import Day05 from "./pages/Day05";

function App() {
  const [mode, setMode] = useState("architectural");
  const [veilOn, setVeilOn] = useState(true);   // ✔ inside App()


  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(
            "--scroll",
            window.scrollY
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Router >
    <>
      {/* Constellation now receives veilOn */}
      <Constellation veilOn={veilOn} />

      <div className={`App mode-${mode}`}>
        <img src={logo} alt="My Reflections Glow logo" className="App-logo" />
        <h1 className="calendar-title">A Month of Light</h1>

        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setMode("architectural")}>Architectural</button>
          <button onClick={() => setMode("water")}>Water</button>
          <button onClick={() => setMode("macro")}>Macro</button>
        </div>


          <Routes>
                {/* Home route — your calendar */}
            <Route path="/" element={<Calendar />} />

              {/* Day pages */}
            <Route path="/day01" element={<Day01 />} />
            <Route path="/day02" element={<Day02 />} />
              {/* Add more here */}
          </Routes>

        <div
          className="mood-orb"
          onClick={() => {
            if (mode === "architectural") setMode("water");
            else if (mode === "water") setMode("macro");
            else setMode("architectural");
          }}
        ></div>

              {/* Toggle button — now works */}
          <button
              className={`veil-toggle ${veilOn ? "glow" : ""}`}
              onClick={() => setVeilOn(v => !v)}
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
              }}
            >
            {veilOn ? "Lower the Veil" : "Lift the Veil"}
          </button>


      </div>
    </>
    </Router>
  );
}

export default App;
