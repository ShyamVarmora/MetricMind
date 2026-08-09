import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import ApiModal from "../components/ApiModal";
import SqlModal from "../components/SqlModal";

import LoadingState from "../components/LoadingState";

import "./Dashboard.css";
import "./Chat.css";

function Chat() {
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth > 768
  );

  const [loading, setLoading] = useState(false);

  const [showApi, setShowApi] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const [messages] = useState([
    {
      id: 1,
      question: "Show me the sales report for June.",
      analysis:
        "Sales increased by 18% compared to May. Revenue growth was mainly driven by increased order volume and higher customer retention.",
      metric: "Revenue, Orders, Profit",
      chart: "📈 Line Chart",
      confidence: "96%",
    },
  ]);

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        {window.innerWidth <= 768 && (
          <button
            className="menu-btn"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        )}

        <div className="dashboard">
          {showSidebar && (
            <Sidebar
              showSidebar={showSidebar}
              closeSidebar={closeMobileSidebar}
            />
          )}

          <div className="dashboard-content">
            <LoadingState />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      {/* TOP HEADER */}

      <Navbar />

      {/* MOBILE MENU */}

      {window.innerWidth <= 768 && (
        <button
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      {/* DASHBOARD LAYOUT */}

      <div className="dashboard">

        {/* SIDEBAR */}

        {showSidebar && (
          <Sidebar
            showSidebar={showSidebar}
            closeSidebar={closeMobileSidebar}
          />
        )}

        {/* MAIN CONTENT */}

        <div className="dashboard-content">

          <div className="welcome-banner">
            <h1>💬 AI Chat</h1>
            <p>Enterprise AI Assistant</p>
          </div>

          <div className="chat-container">

            {messages.length === 0 ? (
              <div className="empty-state">
                <h2>🤖</h2>
                <h3>Start a conversation</h3>
                <p>
                  Your AI assistant responses will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="chat-history">

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="ai-result-card"
                    >

                      <div className="result-section">
                        <h4>❓ Question</h4>
                        <p>{msg.question}</p>
                      </div>

                      <div className="result-section">
                        <h4>🧠 Analysis</h4>
                        <p>{msg.analysis}</p>
                      </div>

                      <div className="result-grid">

                        <div className="result-box">
                          <span className="label">
                            Metric
                          </span>

                          <strong>
                            {msg.metric}
                          </strong>
                        </div>

                        <div className="result-box">
                          <span className="label">
                            Suggested Chart
                          </span>

                          <strong>
                            {msg.chart}
                          </strong>
                        </div>

                        <div className="result-box">
                          <span className="label">
                            Confidence
                          </span>

                          <strong>
                            {msg.confidence}
                          </strong>
                        </div>

                      </div>

                      <div className="result-actions">

                        <button
                          className="secondary-btn"
                          onClick={() => setShowApi(true)}
                        >
                          View API
                        </button>

                        <button
                          className="secondary-btn"
                          onClick={() => setShowSql(true)}
                        >
                          View SQL
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

                <div className="chat-input-area">

                  <input
                    type="text"
                    placeholder="Ask something about your business data..."
                  />

                  <button>
                    Ask AI
                  </button>

                </div>
              </>
            )}

          </div>

        </div>
      </div>

      {/* MODALS */}

      <ApiModal
        open={showApi}
        onClose={() => setShowApi(false)}
      />

      <SqlModal
        open={showSql}
        onClose={() => setShowSql(false)}
      />

      <Footer />
    </>
  );
}

export default Chat;