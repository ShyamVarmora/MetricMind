import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import "./Chat.css";

function Chat() {
  const [messages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! Welcome to MetricMind. How can I help you today?",
    },
    {
      id: 2,
      sender: "user",
      text: "Show me the sales report.",
    },
    {
      id: 3,
      sender: "ai",
      text: "The backend is currently unavailable. This is a UI preview.",
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
            <div className="chat-history">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender === "user" ? "user" : "ai"
                  }`}
                >
                  <div className="bubble">{msg.text}</div>
                </div>
              ))}

              <div className="message ai">
                <div className="bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Type your message..."
              />

              <button>Send</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Chat;