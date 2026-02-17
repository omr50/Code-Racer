import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SinglePlayerGame from "./components/SinglePlayerGame";
import "./App.css";
import Navbar from "./components/Nav/NavBar";
import HomePage from "./components/HomePage/HomePage";
import UserStatsPage from "./components/UserHome/UserStatsPage";

function App() {
  const [count, setCount] = useState(0);

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