function DashboardCard() {
    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px"
            }}
        >
            <div
                style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px"
                }}
            >
                <h3>Total Sales</h3>
                <h2>₹1,20,000</h2>
            </div>

            <div
                style={{
                    background: "#10b981",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px"
                }}
            >
                <h3>Orders</h3>
                <h2>150</h2>
            </div>

            <div
                style={{
                    background: "#f59e0b",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px"
                }}
            >
                <h3>Profit</h3>
                <h2>₹25,000</h2>
            </div>
        </div>
    );
}

export default DashboardCard;