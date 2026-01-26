import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const WpmChart = ({ data }) => {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const legendLabelColor = "black";

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: data.map((_, i) => (i + 1).toString()),
        datasets: [
          {
            label: "Words Per Minute",
            data,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: legendLabelColor,
              font: { size: 16 },
            },
          },
        },
        scales: {
          x: {
            ticks: { maxRotation: 0, minRotation: 0 },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} className="chart" />;
};

export default WpmChart;
