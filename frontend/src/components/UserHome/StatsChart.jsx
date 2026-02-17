import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const StatsChart = ({ games = [] }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    if (chartRef.current) chartRef.current.destroy();

    const labels = games.length
      ? games.map(g =>
          new Date(g.playedAt).toLocaleDateString()
        )
      : Array(5).fill("");

    chartRef.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "WPM",
            data: games.map(g => g.wpm),
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56,189,248,0.1)",
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            yAxisID: "y",
          },
          {
            label: "Accuracy %",
            data: games.map(g => g.accuracy),
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.1)",
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            yAxisID: "y",
          },
          {
            label: "Mistakes",
            data: games.map(g => g.mistakes),
            borderColor: "#ef4444",
            backgroundColor: "rgba(239,68,68,0.1)",
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: "#e5e7eb",
              font: {
                family: "JetBrains Mono",
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#e5e7eb" },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          y: {
            type: "linear",
            position: "left",
            beginAtZero: true,
            ticks: { color: "#38bdf8" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y1: {
            type: "linear",
            position: "right",
            min: 0,
            max: 100,
            ticks: {
              color: "#22c55e",
              callback: value => value + "%"
            },
            grid: { drawOnChartArea: false },
          },
          y2: {
            type: "linear",
            position: "right",
            min: 0,
            max: 100,
            ticks: {
              color: "#22c55e",
              callback: value => value + "%"
            },
            grid: { drawOnChartArea: false },
          },


        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [games]);

  return <canvas ref={ref} />;
};

export default StatsChart;
