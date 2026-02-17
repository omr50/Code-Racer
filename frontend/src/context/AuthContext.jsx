import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedEmail && storedUsername) {
      setToken(storedToken);
      setEmail(storedEmail);
      setUsername(storedUsername);
    }
  }, []);

  const login = (email, username, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    setEmail(email);
    setToken(token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setEmail(null);
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ email, token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
