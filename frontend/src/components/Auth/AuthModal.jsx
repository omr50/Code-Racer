import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function AuthModal({ close }) {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");   // ✅ add
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const { login } = useAuth();

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (!username.trim()) {
          setError("Username is required");
          return;
        }
      }

      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      // ✅ payload differs by mode
      const payload =
        mode === "login"
          ? { email, password }
          : { email, username, password };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        payload
      );

      const token = response.data.token;
      const username = response.data.username;
      console.log("working login?", token, username)

      // If your AuthContext login() only takes (email, token) keep this:
      login(email, username, token);

      // If you update AuthContext to store username too, do:
      // login({ email, username, token });

      close();
    } catch (err) {
      setError("Invalid credentials or user already exists");
    }
  };

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-modal" onClick={stopPropagation}>
        <button className="auth-close" onClick={close}>✕</button>

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

          {/* ✅ username input only for signup */}
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

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
              onChange={(e) => setConfirmPassword(e.target.value)}
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
