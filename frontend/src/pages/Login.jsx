import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // Handle login form submission
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // Django Simple JWT usually expects username and password.
      // This sends the entered email or username as the username.
      const response = await API.post("/token/", {
        username: form.email.trim(),
        password: form.password,
      });

      const { access, refresh } = response.data || {};

      if (!access) {
        throw new Error("The server did not return an access token.");
      }

      // Store authentication tokens
      localStorage.setItem("access", access);

      if (refresh) {
        localStorage.setItem("refresh", refresh);
      } else {
        localStorage.removeItem("refresh");
      }

      // Redirect to the dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);

      const serverError = err.response?.data;

      if (serverError?.detail) {
        setError(String(serverError.detail));
      } else if (serverError?.username) {
        setError(
          Array.isArray(serverError.username)
            ? serverError.username.join(" ")
            : String(serverError.username)
        );
      } else if (serverError?.email) {
        setError(
          Array.isArray(serverError.email)
            ? serverError.email.join(" ")
            : String(serverError.email)
        );
      } else if (err.message?.includes("access token")) {
        setError(err.message);
      } else {
        setError(
          "Login failed. Please check your username and password, then try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">₹</div>
          <h1>CMRS</h1>
          <p>Finance Operations</p>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your finance operations.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email or Username</label>

          <input
            id="email"
            name="email"
            type="text"
            placeholder="Enter your email or username"
            autoComplete="username"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label htmlFor="password">Password</label>

          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          Secure Access to CMRS Finance Operations
        </p>
      </section>
    </main>
  );
}
