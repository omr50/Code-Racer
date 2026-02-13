import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
    }
  }, []);

  const login = (email, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setEmail(email);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setEmail(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
