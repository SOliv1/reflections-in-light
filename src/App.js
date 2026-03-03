import { useState } from "react";
import Calendar from "./components/Calendar";
import "./App.css";



function App() {
  const [mode, setMode] = useState("architectural");

  return (
    <div className={`App mode-${mode}`}>
      <h1 className="calendar-title">A Month of Light</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setMode("architectural")}>Architectural</button>
        <button onClick={() => setMode("water")}>Water</button>
        <button onClick={() => setMode("macro")}>Macro</button>
      </div>

      <Calendar />
    </div>
  );
}

export default App;
