import "./ChatPage.css";

function ChatPage() {
  return (
    <div className="chat-page">

      <div className="chat-header">
        <h2>🤖 MetricMind AI Assistant</h2>
        <p>Ask anything about your business data</p>
      </div>

      <div className="chat-body">

        <div className="bot-message">
          👋 Hello! How can I help you today?
        </div>

        <div className="user-message">
          Show total sales this month.
        </div>

        <div className="bot-message">
          Total sales this month are <strong>₹1,20,000</strong>.
        </div>

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask your question..."
        />

        <button>
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatPage;