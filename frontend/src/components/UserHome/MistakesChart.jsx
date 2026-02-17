import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const MistakesChart = ({ games = [] }) => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const accuracies = games.map(g => g.accuracy);

    const minAcc = accuracies.length
    ? Math.min(...accuracies)
    : 90;

    const maxAcc = accuracies.length
    ? Math.max(...accuracies)
    : 100;

    // Add padding so line isn't hugging borders
    const paddedMin = Math.floor(minAcc - 2);
    const paddedMax = Math.ceil(maxAcc + 2);


  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels: games.map(() => ""),
        datasets: [
          {
            label: "Mistakes",
            data: games.map(g => g.mistakes),
            borderColor: "#ef4444",
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 900,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: { display: false },
            title: {
            display: true,
            text: "Mistakes",
            color: "#ef4444",
            font: {
                size: 14,
                family: "system-ui, Avenir, Helvetica, Arial, sans-serif",
                weight: "600"
            },
            padding: { bottom: 10 }
            }
        },
        scales: {
            x: {
            ticks: { color: "#e5e7eb", maxTicksLimit: 5 },
            grid: { color: "rgba(255,255,255,0.05)" },
            },
            y: {
            beginAtZero: true,
            ticks: {
                color: "#ef4444",
                font: { size: 11 }
            },
            grid: { color: "rgba(255,255,255,0.08)" },
            },
        },
        },


    });

    return () => chartRef.current?.destroy();
  }, [games]);

  return <canvas ref={ref} />;
};

export default MistakesChart;
