
import { useState, useEffect } from "react";
import api from "../api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
];


function ChartSection() {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/sales")
      .then((res) => {
        console.log(res.data);
        setChartData(res.data.sales);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to load sales");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div
      style={{
        background: "#ffffff",
        marginTop: "35px",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      {chartData.map((item, index) => (
        <div key={index}>
          {item.month} : ₹{item.revenue}
        </div>
      ))}

      <h2
        style={{
          marginBottom: "20px",
          color: "#1e293b",
        }}
      >
        📈 Sales Overview
      </h2>

      <div
        style={{
          width: "100%",
          height: "320px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartSection;