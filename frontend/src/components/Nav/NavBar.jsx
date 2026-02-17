import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Languages } from "./languages";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, username, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const [language, setLanguage] = useState("javascript");
  const [languageColor, setLanguageColor] = useState("#F7DF1E");

  const startGame = () => {
    navigate(`/game/${language}`);
  };

  return (
    <>
      <nav className="navbar">

        {/* Left: Brand */}
        <div
          className="navbar-brand"
          onClick={() => navigate("/")}
        >
          <span className="brand-text">
            &lt;CodeRacer/&gt;
          </span>
          <span className="brand-cursor" />
        </div>

        {/* Right: Controls */}
        <div className="navbar-controls">

          {/* Auth Section */}
          {username ? (
            <div className="navbar-user" onClick={() => navigate('/user')}>
              <div className="user-badge">
                {email.charAt(0).toUpperCase()}
              </div>

              <span className="user-email">{username}</span>

              <button
                className="navbar-logout"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="navbar-auth-btn"
              onClick={() => setShowAuth(true)}
            >
              Login / Sign Up
            </button>
          )}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="navbar-select"
          >
            {Languages.map(l => (
              <option key={l.language} style={{ color: l?.color || "#e5e7eb" }} value={l.language}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Play Button */}
          <button
            className="navbar-play"
            onClick={startGame}
          >
            ▶ Play
          </button>
        </div>
      </nav>

      {showAuth && <AuthModal close={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;
