import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import ApiModal from "../components/ApiModal";
import SqlModal from "../components/SqlModal";

import "./Dashboard.css";
import "./Chat.css";

function Chat() {
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

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar />

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
                <p>Your AI assistant responses will appear here.</p>
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

                          <strong>{msg.metric}</strong>
                        </div>

                        <div className="result-box">
                          <span className="label">
                            Suggested Chart
                          </span>

                          <strong>{msg.chart}</strong>
                        </div>

                        <div className="result-box">
                          <span className="label">
                            Confidence
                          </span>

                          <strong>{msg.confidence}</strong>
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