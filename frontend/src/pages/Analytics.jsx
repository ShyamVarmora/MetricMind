import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./Dashboard.css";

function Analytics() {
  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar />

        <div className="dashboard-content">
          <div className="welcome-banner">
            <h1>📊 Analytics</h1>
            <p>Analytics page coming soon.</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Analytics;