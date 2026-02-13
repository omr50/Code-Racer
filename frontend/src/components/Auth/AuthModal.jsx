import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function AuthModal({ close }) {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const { login } = useAuth();

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup" && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/register";

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        { email, password }
      );

      const token = response.data.token;

      // UPDATE GLOBAL CONTEXT
      login(email, token);

      // close modal
      close();
    } catch (err) {
      setError("Invalid credentials or user already exists");
    }
  };

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-modal" onClick={stopPropagation}>
        <button className="auth-close" onClick={close}>
          ✕
        </button>

        <div className="auth-switch">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
