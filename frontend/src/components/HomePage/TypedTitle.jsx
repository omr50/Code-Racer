import { useEffect, useState } from "react";

export default function TypedTitle({
  text,
  speed = 100,
  pause = 2000,
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done && index < text.length) {
      const t = setTimeout(() => {
        setIndex((i) => i + 1);
      }, speed);
      return () => clearTimeout(t);
    }

    if (!done && index === text.length) {
      const t = setTimeout(() => {
        setDone(true);
      }, pause);
      return () => clearTimeout(t);
    }

    if (done) {
      const t = setTimeout(() => {
        setIndex(0);
        setDone(false);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [index, done, text, speed, pause]);

  return (
  <h1 className="typed-title">
    <span className="typed-text">
      {text.slice(0, index) || "\u00A0"}
    </span>
    <span className="cursor" />
  </h1>
);

}
