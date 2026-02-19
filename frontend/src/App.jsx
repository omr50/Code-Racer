import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SinglePlayerGame from "./components/SinglePlayerGame";
import "./App.css";
import Navbar from "./components/Nav/NavBar";
import HomePage from "./components/HomePage/HomePage";
import UserStatsPage from "./components/UserHome/UserStatsPage";
import { initApiInterceptors } from "./api";
import { useAuth } from "./context/AuthContext";

function App() {
  const [count, setCount] = useState(0);

  const { logout } = useAuth();
  const navigate = useNavigate()
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    initApiInterceptors({logout, navigate});
    console.log("[App] api interceptors initialized");
  }, [logout, navigate]);

  return (
    <>
      <Navbar/> 
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/game/:language" element={<SinglePlayerGame />} />
        <Route path="/user" element={<UserStatsPage/>} />
      </Routes>
    </>
  );
}

export default App;