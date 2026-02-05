import { useEffect, useState } from "react";
import { Languages } from "../Nav/languages";
import "./HomePage.css"

export default function LanguageCarousel() {
  const [index, setIndex] = useState(0);
  const lang = Languages[index];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % Languages.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="language-carousel"
      style={{ "--glow": lang.color }}
    >
      <div className="language-icon">{lang.img}</div>
      <div className="language-name">{lang.language}</div>
    </div>
  );
}
