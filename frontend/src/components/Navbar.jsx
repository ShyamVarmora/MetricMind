import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2>MetricMind</h2>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search..."
          className="search-box"
        />
      </div>

      <div className="navbar-right">
        <button className="icon-btn">🔔</button>
      </div>

    </nav>
  );
}

export default Navbar;