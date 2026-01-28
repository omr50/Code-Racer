import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const LANGUAGES = ["javascript", "python", "go", "cpp"];

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
        Code<span>Racer</span>
      </div>

      {/* Right: Controls */}
      <div className="navbar-controls">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="navbar-select"
        >
          {LANGUAGES.map(l => (
            <option key={l} value={l}>
              {l.toUpperCase()}
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
