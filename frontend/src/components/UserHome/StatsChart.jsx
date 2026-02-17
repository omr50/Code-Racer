import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const StatsChart = ({ data = [], labels = [] }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels: labels.length ? labels : Array(5).fill(""),
        datasets: [
          {
            label: "WPM",
            data: data.length ? data : [],
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56,189,248,0.15)",
            fill: false,
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#38bdf8",
            pointBorderColor: "#020617",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "#e5e7eb" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y: {
            ticks: { color: "#e5e7eb" },
            grid: { color: "rgba(255,255,255,0.08)" },
            beginAtZero: true,
          },
        },
      },
    });
  }, [data, labels]);

  return <canvas ref={ref} />;
};

export default StatsChart;
