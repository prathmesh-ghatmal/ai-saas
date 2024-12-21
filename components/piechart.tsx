import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

// Register required components and plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  conversation: number;
  code: number;
  image: number;
  music: number;
  video: number;
}

const PieChart = ({
  conversation,
  code,
  image,
  music,
  video,
}: PieChartProps) => {
  const data = {
    labels: [
      "Conversation",
      "Code Generation",
      "Image Generation",
      "Video Generation",
      "Music Generation",
    ],
    datasets: [
      {
        label: "Generations",
        data: [conversation, code, image, video, music],
        backgroundColor: [
          "#8b5cf6",
          "#eab308",
          "#ec4899",
          "#f97316",
          "#10b981",
        ],
        hoverBackgroundColor: [
          "rgba(139, 92, 246, 0.5)",
          "rgba(234, 179, 8, 0.5)",
          "rgba(236, 72, 153, 0.5)",
          "rgba(249, 115, 22, 0.5)",
          "rgba(16, 185, 129, 0.5)",
        ],
      },
    ],
  };

  // Explicitly type options
  const options: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        position: "right", // Full label in legend
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
      datalabels: {
        color: "#fff", // Text color
        formatter: (value: number, context) => {
          if (value === 0) {
            return ""; // Hide labels for zero values
          }
          const dataset = context.dataset.data as number[];
          const total = dataset.reduce((acc, dataValue) => acc + dataValue, 0);
          const percentage = ((value / total) * 100).toFixed(1);

          // Shorten the label for slices (e.g., "Code Generation" -> "Code")
          const shortLabels: { [key: string]: string } = {
            Conversation: "Convo",
            "Code Generation": "Code",
            "Image Generation": "Image",
            "Video Generation": "Video",
            "Music Generation": "Music",
          };

          // Safely access the label using context.chart.data.labels
          const label = context.chart.data.labels?.[context.dataIndex] as
            | string
            | undefined;

          const shortLabel = label ? shortLabels[label] : "";

          return shortLabel ? `${shortLabel}\n${percentage}%` : "";
        },
        font: {
          weight: "bold",
        },
        align: "center", // Align the text horizontally in the center
        anchor: "center", // Anchor it at the center
        offset: 10, // Distance from the center (move it down)
      },
    },
    maintainAspectRatio: true, // Maintain default size and aspect ratio
    responsive: true, // Ensure it resizes appropriately
  };

  return (
    <div className="text-lg text-black">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
