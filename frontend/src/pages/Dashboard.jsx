import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import RecentTransactions from "../components/RecentTransactions";

import Footer from "../components/Footer";

import Chat from "./Chat";

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