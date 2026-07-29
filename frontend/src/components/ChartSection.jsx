import { useState, useEffect } from "react";
import api from "../api";

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
        background: "white",
        border: "2px dashed gray",
        borderRadius: "10px",
        height: "250px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px"
      }}
    >
      {chartData.map((item, index) => (
        <div key={index}>
          {item.month} : ₹{item.revenue}
        </div>
      ))}
    </div>
  );
}

export default ChartSection;