import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SinglePlayerGame from "./components/SinglePlayerGame";
import "./App.css";
import Navbar from "./components/Nav/NavBar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar/> 
      <Routes>
        <Route path="/" element={<div>HEY</div>} />
        <Route path="/game/:language" element={<SinglePlayerGame />} />
      </Routes>
    </>
  );
}

export default App;