import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
<<<<<<< HEAD
import ChartSection from "../components/ChartSection";
=======
>>>>>>> 20219f4376a17a2068a70c82a3f67c89a00a3114
import Footer from "../components/Footer";

function Dashboard() {
    return (
        <>
            <Navbar />

            <div
                style={{
                    display: "flex"
                }}
            >
                <Sidebar />

                <div
                    style={{
                        flex: 1,
                        padding: "30px",
                        background: "#f3f4f6"
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