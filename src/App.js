import { useState, useEffect } from "react";
import Constellation from "./components/Constellation";
import Calendar from "./components/Calendar";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  const [mode, setMode] = useState("architectural");

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
    <>
      <Constellation />

      <div className={`App mode-${mode}`}>
        <img src={logo} alt="My Reflections Glow logo" className="App-logo" />
        <h1 className="calendar-title">A Month of Light</h1>

        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setMode("architectural")}>Architectural</button>
          <button onClick={() => setMode("water")}>Water</button>
          <button onClick={() => setMode("macro")}>Macro</button>
        </div>

        <Calendar />

        <div
          className="mood-orb"
          onClick={() => {
            if (mode === "architectural") setMode("water");
            else if (mode === "water") setMode("macro");
            else setMode("architectural");
          }}
        ></div>
      </div>
    </>
  );
}

export default App;
