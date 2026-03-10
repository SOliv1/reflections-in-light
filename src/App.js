import { useState } from "react";
import Constellation from "./components/Constellation";
import Calendar from "./components/Calendar";
import "./App.css";
import logo from './assets/logo.png';




function App() {
  const [mode, setMode] = useState("architectural");

  return (
    <div className={`App mode-${mode}`}>

      <div class="constellation-wrapper interactive active">
        <div class="constellation-overlay"></div>
        <Constellation />
      </div>


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
  );
}

export default App;
