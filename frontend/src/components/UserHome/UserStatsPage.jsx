import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import StatsChart from "./StatsChart";
import "./UserStats.css";

const UserStatsPage = () => {
  const [games, setGames] = useState([]);
  const [language, setLanguage] = useState("ALL");

  useEffect(() => {
    fetchGames();
  }, [language]);

  const fetchGames = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/games`,
        {
          params: language !== "ALL" ? { language } : {},
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setGames(res.data);
    } catch (err) {
      console.error(err);
      setGames([]); // ensure array
    }
  };

  // Sort by highest WPM for personal best
  const bestGame = useMemo(() => {
    if (!games.length) return null;
    return [...games].sort((a, b) => b.wpm - a.wpm)[0];
  }, [games]);

  return (
    <div className="userstats-root">
        <div className="userstats-container">

      {/* TOP BAR */}
      <div className="stats-topbar">
        <h1>Your Performance</h1>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="ALL">All Languages</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="javascript">Javascript</option>
          <option value="c#">C#</option>
          <option value="html">HTML</option>
          <option value="go">Go</option>
          <option value="python">Python</option>
          <option value="typescript">Typescript</option>
          <option value="kotlin">Kotlin</option>
        </select>
      </div>

      {/* PERSONAL BEST */}
      {bestGame && (
        <div className="best-card">
          <div className="best-label">PERSONAL BEST</div>
          <div className="best-value">{bestGame.wpm} WPM</div>
          <div className="best-meta">
            {bestGame.language} • {bestGame.accuracy}% accuracy
          </div>
        </div>
      )}

      {/* CHART ALWAYS VISIBLE */}
      <div className="stats-chart-wrapper">
        <StatsChart
          data={games.map(g => g.wpm)}
          labels={games.map(g =>
            new Date(g.playedAt).toLocaleDateString()
          )}
        />
      </div>

      {/* GAME LIST */}
      <div className="stats-table">
        {games.length === 0 ? (
          <div className="empty-state">
            No games played for this language yet.
          </div>
        ) : (
          games.map((g, i) => (
            <div key={g.id} className="table-row">
              <div>#{i + 1}</div>
              <div>{g.wpm} WPM</div>
              <div>{g.accuracy}%</div>
              <div>{g.language}</div>
              <div>{g.durationSeconds}s</div>
            </div>
          ))
        )}
      </div>

    </div>
    </div>
  );
};

export default UserStatsPage;
