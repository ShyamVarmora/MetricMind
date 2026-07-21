import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import RecentTransactions from "../components/RecentTransactions";
<<<<<<< HEAD

=======
>>>>>>> a5939d7 (Resolve Dashboard merge conflict)
import Footer from "../components/Footer";

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar />

      <button
        onClick={() => setShowSidebar(!showSidebar)}
        style={{
          margin: "15px",
          padding: "10px 15px",
          fontSize: "22px",
          cursor: "pointer",
          border: "none",
          borderRadius: "8px",
          background: "#2563EB",
          color: "white",
        }}
      >
        ☰
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {(window.innerWidth > 768 || showSidebar) && <Sidebar />}

        <div
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "30px",
            background: "#F8FAFC",
            minHeight: "100vh",
          }}
        >
          <DashboardCard />
          <ChartSection />
          <RecentTransactions />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;