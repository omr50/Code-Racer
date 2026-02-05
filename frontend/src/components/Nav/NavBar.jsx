import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Languages } from "./languages";
import "./Navbar.css";
import "../HomePage/HomePage.css"


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguage] = useState("javascript");

  const startGame = () => {
    navigate(`/game/${language}`);
  };

  return (
    <nav className="navbar">
      {/* Left: Brand */}
      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
      >
        <span className="brand-text">
          Code<span className="brand-accent">Racer</span>
        </span>
        <span className="brand-cursor" />
      </div>


      {/* Right: Controls */}
      <div className="navbar-controls">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="navbar-select"
        >
          {Languages.map(l => (
            <option key={l} value={l.language}>
              {l.symbol + " " + l.language.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          className="navbar-play"
          onClick={startGame}
        >
          ▶ Play
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
