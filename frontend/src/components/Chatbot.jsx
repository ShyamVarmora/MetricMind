import { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!input.trim()) return;

    setLoading(true);

    // UI preview only
    setTimeout(() => {
      setLoading(false);
      setInput("");
    }, 1000);
  };

  return (
    <div className="chatbot">

      <div className="chatbot-header">
        <div>
          <h3>🤖 MetricMind AI</h3>
          <span>Business Data Assistant</span>
        </div>

        <div className="chatbot-status">
          <span className="status-dot"></span>
          Online
        </div>
      </div>

      <div className="chatbot-body">

        <div className="chatbot-welcome">
          <div className="bot-icon">🤖</div>

          <h3>How can I help you?</h3>

          <p>
            Ask questions about your sales, revenue, customers,
            or business performance.
          </p>
        </div>

        {loading && (
          <div className="chatbot-loading">
            <span></span>
            <span></span>
            <span></span>
            <p>Analyzing your request...</p>
          </div>
        )}

      </div>

      <div className="chatbot-input-area">

        <input
          type="text"
          value={input}
          placeholder="Ask something about your business data..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
        />

        <button
          onClick={handleAsk}
          disabled={loading || !input.trim()}
        >
          {loading ? "..." : "Ask AI"}
        </button>

      </div>

    </div>
  );
}

export default Chatbot;