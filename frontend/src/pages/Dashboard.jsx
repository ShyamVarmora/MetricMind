import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: "1",
            minWidth: "300px",
            padding: "30px",
           background: "#F8FAFC",
            minHeight: "100vh",
          }}
        >
          <DashboardCard />

          <ChartSection />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;