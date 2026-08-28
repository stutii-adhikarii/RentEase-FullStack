import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    setBusy(true);
    try {
      const user = await login(form);
      navigate(user.role === "landlord" ? "/dashboard" : "/apartments");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container auth-page">
      <div className="auth-card login-only">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <p className="logo">Rent Ease</p>
          <h1>Welcome back</h1>
          <p className="muted">Please enter your details to sign in.</p>

          <div className="form-row">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="hello@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {error ? <span className="form-error">{error}</span> : null}
          <button
            type="submit"
            className="btn btn-primary btn-wide"
            style={{ marginTop: 16 }}
            disabled={busy}
          >
            {busy ? "Signing in…" : "Login"}
          </button>
          <p className="muted" style={{ marginTop: 16 }}>
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
