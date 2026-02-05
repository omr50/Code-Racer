import TypedTitle from "./TypedTitle";
import LanguageCarousel from "./LanguageCarousel";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const navigate = useNavigate();

  const startGame = () => {
    navigate(`/game/c`);
  };

  return (
    <div className="home">

      {/* HERO */}
      {/* HERO */}
      <section className="hero-section">
        <TypedTitle text="Code Racer" />

        <p className="tagline">
          A competitive typing game — but with real code.
        </p>

        <div className="hero-actions">
          <LanguageCarousel />
          <button className="play-button" onClick={startGame}>
            ▶ Play Now
          </button>
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="info-section">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <span className="step-num">01</span>
            <h3>Join a Race</h3>
            <p>Get matched instantly with other players.</p>
          </div>

          <div className="step">
            <span className="step-num">02</span>
            <h3>Type the Code</h3>
            <p>Replicate real code snippets character-by-character.</p>
          </div>

          <div className="step">
            <span className="step-num">03</span>
            <h3>Win on Accuracy</h3>
            <p>Mistakes slow you down. Precision wins races.</p>
          </div>
        </div>
      </section>

      {/* WHY PLAY */}
      <section className="info-section alt">
        <h2>Why Code Racer?</h2>

        <div className="features">
          <div>⚡ Build real typing speed</div>
          <div>🎯 Accuracy over spam</div>
          <div>⌨️ Real languages, real syntax</div>
          <div>🏁 Competitive and skill-based</div>
        </div>
      </section>

    </div>
  );
}
