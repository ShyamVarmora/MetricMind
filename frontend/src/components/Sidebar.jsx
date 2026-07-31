function Sidebar({ setActivePage }) {
    return (
        <div
            style={{
                width: "220px",
                background: "#1e293b",
                color: "white",
                padding: "20px",
                minHeight: "500px"
            }}
        >
            <h3>Dashboard</h3>

            <p
                style={{ cursor: "pointer" }}
                onClick={() => setActivePage("dashboard")}
            >
                📊 Analytics
            </p>

            <p>📁 Reports</p>

            <p
                style={{ cursor: "pointer" }}
                onClick={() => setActivePage("chat")}
            >
                🤖 Ask MetricMind
            </p>

            <p>⚙ Settings</p>
        </div>
    );
}

export default Sidebar;

