
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import RecentTransactions from "../components/RecentTransactions";

import Footer from "../components/Footer";

import Chat from "./Chat";

function Dashboard() {
    const [activePage, setActivePage] = useState("dashboard");
    
    return (
        <>
            <Navbar />

            <div
                style={{
                    display: "flex"
                }}
            >
                <Sidebar setActivePage={setActivePage} />

                <div
                    style={{
                        flex: 1,
                        padding: "30px",
                        background: "#f3f4f6"
                    }}
                >
                    {activePage === "dashboard" ? (
                        <>
                            <DashboardCard />
                            <ChartSection />
                            <RecentTransactions />
                        </>
                    ) : (
                        <Chat />
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Dashboard;