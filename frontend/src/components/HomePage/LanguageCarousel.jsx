import { useEffect, useRef } from "react";
import { Languages } from "../Nav/languages";
import "./HomePage.css";

export default function LanguageCarousel({ index, setIndex }) {
  const intervalRef = useRef(null);

  const lang = Languages[index];

  // Auto-rotate
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [index]);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % Languages.length);
    }, 1500);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const prev = () => {
    stopAuto();
    setIndex((i) => (i - 1 + Languages.length) % Languages.length);
  };

  const next = () => {
    stopAuto();
    setIndex((i) => (i + 1) % Languages.length);
  };

  return (
    <>
    <div
      className="language-carousel"
      style={{ "--glow": lang.color }}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <button className="carousel-arrow left" onClick={prev}>
        ‹
      </button>

      <div className="language-icon">{lang.img}</div>
      <div className="language-name">{lang.name}</div>

      <button className="carousel-arrow right" onClick={next}>
        ›
      </button>
    </div>
    </>
  );
}
