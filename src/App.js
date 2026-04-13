import { BrowserRouter as Router } from "react-router-dom";
import AppShell from "./components/AppShell";
import "./App.css";

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
