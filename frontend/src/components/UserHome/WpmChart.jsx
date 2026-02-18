import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const WpmChart = ({ games = [] }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels: games.map(g =>
          new Date(g.playedAt).toLocaleDateString()
        ),
        datasets: [
          {
            label: "WPM",
            data: games.map(g => g.wpm),
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56,189,248,0.1)",
            borderWidth: 3,
            tension: 0.1,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Words Per Minute (WPM)",
            color: "#38bdf8",
            font: {
            size: 18,
            family: "system-ui, Avenir, Helvetica, Arial, sans-serif",
            weight: "600"
            },
            padding: {
            bottom: 20
            }
        }
        },
        scales: {
          x: {
            ticks: { color: "#e5e7eb" },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#38bdf8" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [games]);

  return <canvas ref={ref} />;
};

export default WpmChart;
