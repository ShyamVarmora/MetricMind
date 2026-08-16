import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/register",
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }
      );

      console.log(
        "Register response:",
        response.data
      );

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      if (err.response) {
        setError(
          err.response.data?.detail ||
            "Registration failed."
        );
      } else if (err.request) {
        setError(
          "Network Error: Cannot connect to the server."
        );
      } else {
        setError(
          err.message ||
            "Something went wrong."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>MetricMind</h1>

          <p>
            Create your account
          </p>

        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {success && (
          <div
            className="login-success"
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="form-group">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              autoComplete="name"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              autoComplete="email"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              autoComplete="new-password"
              required
            />

          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>

        </form>

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "none",
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Register;