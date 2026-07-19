import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex", minHeight: "80vh" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          <h2>Dashboard</h2>

          <DashboardCard />
          <DashboardCard />
          <DashboardCard />

          <h3>Recent Activity</h3>
          <p>No recent activity.</p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;