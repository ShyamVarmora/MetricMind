import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const formData = new URLSearchParams();

      formData.append("username", email.trim());
      formData.append("password", password);
      formData.append("grant_type", "password");

      const response = await api.post(
        "/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      // Check token
      if (!response.data?.access_token) {
        throw new Error(
          "Access token was not received."
        );
      }

      // Save token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      // Optional: save user email
      localStorage.setItem(
        "userEmail",
        email.trim()
      );

      console.log("Login successful!");

      // Go to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Response:",
          err.response.data
        );

        setError(
          err.response.data?.detail ||
            "Invalid email or password."
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
            Login to your dashboard
          </p>

        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

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

          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              autoComplete="current-password"
              required
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;