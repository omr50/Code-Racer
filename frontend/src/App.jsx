import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SinglePlayerGame from "./components/SinglePlayerGame";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<div>HEY</div>} />
      <Route path="/game/:language" element={<SinglePlayerGame />} />
    </Routes>
  );
}

export default App;