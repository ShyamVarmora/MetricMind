import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ApiModal from "../components/ApiModal";
import SqlModal from "../components/SqlModal";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import "./Dashboard.css";
import "./Chat.css";

const HISTORY_KEY = "metricmind_chat_history";
const DRAFT_KEY = "metricmind_chat_draft";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function Table({ rows, title }) {
  if (!Array.isArray(rows) || !rows.length || !rows[0]) return null;
  const columns = Object.keys(rows[0]);
  return (
    <div className="chat-data-table-wrap">
      {title && <h4>{title}</h4>}
      <table className="chat-data-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column}>{row[column] ?? "—"}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function ResultChart({ message }) {
  const rows = Array.isArray(message.data) ? message.data : [];
  if (!rows.length || !rows.every((row) => row && row.label !== undefined && row.value !== undefined)) return null;
  const groupBy = message.query?.group_by?.[0] || "";
  const isTimeSeries = ["month", "quarter", "year"].includes(groupBy);
  return (
    <div className="chat-chart">
      <h4>📈 Visual result</h4>
      <ResponsiveContainer width="100%" height={260}>
        {isTimeSeries ? (
          <LineChart data={rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} /></LineChart>
        ) : (
          <BarChart data={rows.slice(0, 10)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" angle={-25} textAnchor="end" height={70} /><YAxis /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function ResultData({ message }) {
  if (Array.isArray(message.data)) {
    if (!message.data.length || !message.data[0] || message.data[0].label !== undefined) return null;
    return <Table rows={message.data} />;
  }
  if (message.data && typeof message.data === "object") {
    return (
      <div className="structured-result">
        <Table rows={message.data.quarters} title="Quarter comparison" />
        <Table rows={message.data.cost_breakdown} title="Secondary cost breakdown" />
      </div>
    );
  }
  return null;
}

function Chat() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [question, setQuestion] = useState(() => localStorage.getItem(DRAFT_KEY) || "");
  const [messages, setMessages] = useState(() => readStorage(HISTORY_KEY, []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTrace, setSelectedTrace] = useState([]);
  const [selectedSql, setSelectedSql] = useState("");

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { if (question) localStorage.setItem(DRAFT_KEY, question); else localStorage.removeItem(DRAFT_KEY); }, [question]);

  const askQuestion = async (event) => {
    event?.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    setError(""); setLoading(true); setQuestion("");
    try {
      const response = await api.post("/ask", { question: value });
      const payload = response.data;
      if (!payload.success) throw new Error(payload.message || "The assistant could not answer that question.");
      const result = payload.data || {};
      setMessages((current) => [...current, {
        id: `${Date.now()}-${current.length}`,
        question: value,
        answer: result.answer || "No answer returned.",
        data: result.data || [],
        apiTrace: result.api_trace || [],
        query: result.query || {},
        sql: result.sql || "",
        reasoningSteps: result.reasoning_steps || [],
      }]);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || err.message || "Unable to process the question.");
    } finally { setLoading(false); }
  };

  const closeSidebar = () => { if (window.innerWidth <= 768) setShowSidebar(false); };

  return (
    <>
      <Navbar />
      {window.innerWidth <= 768 && <button className="menu-btn" onClick={() => setShowSidebar(!showSidebar)} aria-label="Toggle sidebar">☰</button>}
      <div className="dashboard">
        {showSidebar && <Sidebar showSidebar={showSidebar} closeSidebar={closeSidebar} />}
        <div className="dashboard-content">
          <div className="welcome-banner"><h1>💬 Ask MetricMind</h1><p>Ask business questions in plain language. The agent uses governed database queries instead of user-supplied SQL.</p></div>
          <div className="chat-container">
            {messages.length > 0 && <div className="chat-toolbar"><span>{messages.length} saved question{messages.length === 1 ? "" : "s"}</span><button type="button" className="clear-chat-btn" onClick={() => { setMessages([]); setError(""); }}>Clear history</button></div>}
            {messages.length === 0 && !loading && <div className="empty-state"><h2>Ask your first question</h2><p>Try “Hello”, “Q3 Revenue”, “Show European sales”, “Why did sales go up?”, or “Why did our European margins drop last quarter?”.</p></div>}
            <div className="chat-history">
              {messages.map((msg) => (
                <div key={msg.id} className="ai-result-card">
                  <div className="result-section"><h4>❓ Question</h4><p>{msg.question}</p></div>
                  <div className="result-section"><h4>🧠 Answer</h4><p>{msg.answer}</p></div>
                  {msg.reasoningSteps?.length > 0 && <div className="reasoning-box"><h4>🔎 Reasoning path</h4><ol>{msg.reasoningSteps.map((step, index) => <li key={index}>{step}</li>)}</ol></div>}
                  <ResultChart message={msg} />
                  <ResultData message={msg} />
                  <div className="result-grid">
                    <div className="result-box"><span className="label">Data</span><strong>{Array.isArray(msg.data) ? `${msg.data.length} result row(s)` : "Structured result"}</strong></div>
                    <div className="result-box"><span className="label">Governance</span><strong>No direct SQL from user input</strong></div>
                    <div className="result-box"><span className="label">Trace</span><strong>{Array.isArray(msg.apiTrace) ? msg.apiTrace.length : 0} step(s)</strong></div>
                  </div>
                  <div className="result-actions"><button className="secondary-btn" onClick={() => setSelectedTrace(msg.apiTrace)}>View API Call</button><button className="secondary-btn" onClick={() => setSelectedSql(msg.sql || "No database SQL was required for this conversational request.")}>View SQL</button></div>
                </div>
              ))}
            </div>
            {error && <div className="error-card"><strong>Unable to answer</strong><p>{error}</p></div>}
            {loading && <div className="loading-message">MetricMind is analysing the request…</div>}
            <form className="chat-input-area" onSubmit={askQuestion}><input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask something about your business data..." aria-label="Ask MetricMind" disabled={loading} /><button type="submit" disabled={loading || !question.trim()}>{loading ? "Working…" : "Ask AI"}</button></form>
          </div>
        </div>
      </div>
      <ApiModal open={selectedTrace.length > 0} onClose={() => setSelectedTrace([])} trace={selectedTrace} />
      <SqlModal open={Boolean(selectedSql)} onClose={() => setSelectedSql("")} sql={selectedSql} />
      <Footer />
    </>
  );
}

export default Chat;
