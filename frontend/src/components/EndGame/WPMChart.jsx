import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const WpmChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const accent = "#38bdf8";
    const grid = "rgba(255,255,255,0.08)";
    const text = "#e5e7eb";

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",

      data: {
        labels: data.map((_, i) => i + 1),
        datasets: [
          {
            label: "WPM",
            data,
            borderColor: accent,
            backgroundColor: "rgba(56,189,248,0.25)",
            fill: true,
            tension: 0.3,

            pointRadius: 0,
            pointHoverRadius: 5,   // ✅ ADD
            pointHitRadius: 10,    // ✅ ADD

            borderWidth: 2,
          },
        ],

      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true,
            labels: {
              color: text,
              padding: 20,
              boxWidth: 14,
              boxHeight: 14,
              usePointStyle: true,
              pointStyle: "rectRounded",
              font: {
                family: "JetBrains Mono",
                size: 14,
              },
            },
          },
        },

        scales: {
          x: {
            ticks: { color: text },
            grid: { color: grid },
          },
          y: {
            ticks: { color: text },
            grid: { color: grid },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [data]);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default WpmChart;
