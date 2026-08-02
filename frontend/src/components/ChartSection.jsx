import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useNavigate } from "react-router-dom";

import "./ChartSection.css";

function ChartSection({ data = [] }) {
  const navigate = useNavigate();

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2>📈 Sales Overview</h2>
          <p>Monthly sales performance</p>
        </div>

        <button
          className="chart-btn"
          onClick={() => navigate("/reports")}
        >
          View Report
        </button>
      </div>

      {data.length === 0 ? (
        <div
          style={{
            height: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          No chart data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563EB"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ChartSection;