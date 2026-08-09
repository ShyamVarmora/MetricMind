import { useState } from "react";
import "./ChatPage.css";

function ChatPage() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("User message:", message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-page">

      {/* =========================
          CHAT HEADER
      ========================= */}

      <div className="chat-header">
        <div className="chat-title">
          <div className="ai-icon">🤖</div>

          <div>
            <h2>MetricMind AI Assistant</h2>
            <p>Ask anything about your business data</p>
          </div>
        </div>

        <div className="online-status">
          <span></span>
          AI Online
        </div>
      </div>

      {/* =========================
          CHAT BODY
      ========================= */}

      <div className="chat-body">

        {/* Welcome Message */}

        <div className="message-row bot-row">
          <div className="message-avatar">
            🤖
          </div>

          <div className="message-content">
            <span className="message-name">MetricMind AI</span>

            <div className="bot-message">
              👋 Hello! How can I help you today?
            </div>
          </div>
        </div>

        {/* User Message */}

        <div className="message-row user-row">

          <div className="message-content">
            <span className="message-name">You</span>

            <div className="user-message">
              Show total sales this month.
            </div>
          </div>

          <div className="message-avatar user-avatar">
            👤
          </div>

        </div>

        {/* AI Response */}

        <div className="message-row bot-row">

          <div className="message-avatar">
            🤖
          </div>

          <div className="message-content">
            <span className="message-name">MetricMind AI</span>

            <div className="bot-message">
              Total sales this month are
              <strong> ₹1,20,000</strong>.
            </div>
          </div>

        </div>

      </div>

      {/* =========================
          INPUT AREA
      ========================= */}

      <div className="chat-input-container">

        <div className="chat-input">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
          />

          <button
            onClick={handleSend}
            disabled={!message.trim()}
          >
            Send ➤
          </button>

        </div>

        <p className="chat-hint">
          Press Enter to send your message
        </p>

      </div>

    </div>
  );
}

export default ChatPage;