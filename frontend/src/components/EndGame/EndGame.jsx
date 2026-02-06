import WpmChart from "./WPMChart";
import './EndGame.css'
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { Button } from "react-bootstrap";
import replay from '../../media/new_game_gif.gif'

const EndGame = (props) => {
  const navigate = useNavigate()

  const Metric = ({ label, value }) => (
  <div className="metric-card">
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
  </div>
);

  return (
  <div className="endgame-root">
    <div className="endgame-panel">
      

      <div className="metrics-grid">
        <Metric label="WPM" value={props.wpm} />
        <Metric label="Time" value={`${props.time}s`} />
        <Metric label="Mistakes" value={props.mistakes} />
        <Metric label="Accuracy" value={`${props.accuracy}%`} />
      </div>

      <div className="chart-container">
        <WpmChart data={props.wpmArray} />
      </div>

      <div className="endgame-actions">
        <button
          className="endgame-btn primary"
          onClick={() => props.changeGameState(true)}
        >
          <span className="spin">⟳</span> New Game
        </button>

        <button
          className="endgame-btn secondary"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

      </div>
    </div>
  </div>
);


}

export default EndGame;