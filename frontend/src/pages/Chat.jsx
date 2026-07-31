import { useState } from "react";

function Chat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "MetricMind",
            text: "Hello 👋 Ask me anything about your business.",
        },
    ]);
    const [typing, setTyping] = useState(false);

    const handleSend = () => {
        if (input.trim() === "") return;

        setMessages([
            ...messages,
            { sender: "You", text: input },
        ]);

        setInput(""); 
            

        setTyping(true);

        setTimeout(() => {
            setTyping(false);
        }, 2000);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h1>Ask MetricMind</h1>

            <div
                style={{
                    border: "1px solid #ccc",
                    height: "400px",
                    padding: "15px",
                    overflowY: "auto",
                    marginBottom: "20px",
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent:
                                msg.sender === "You" ? "flex-end" : "flex-start",
                            marginBottom: "15px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor:
                                    msg.sender === "You" ? "#007bff" : "#f1f1f1",
                                color:
                                    msg.sender === "You" ? "white" : "black",
                                padding: "10px 15px",
                                borderRadius: "15px",
                                maxWidth: "60%",
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginBottom: "15px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#f1f1f1",
                                padding: "10px 15px",
                                borderRadius: "15px",
                            }}
                        >
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            <input
                type="text"
                placeholder="Ask your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    width: "75%",
                    padding: "10px",
                }}
            />

            <button
                onClick={handleSend}
                style={{
                    padding: "10px 20px",
                    marginLeft: "10px",
                }}
            >
                Send
            </button>
        </div>
    );
}

export default Chat;
