import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "tenant",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await register(form);
      const user = await login({ email: form.email, password: form.password });
      navigate(user.role === "landlord" ? "/dashboard" : "/apartments");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <div className="auth-visual">
          <p className="logo" style={{ color: "#fff" }}>
            Rent Ease
          </p>
          <div>
            <h2>Find your next home.</h2>
            <p>Join thousands of others finding their perfect space.</p>
          </div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>Create an Account</h1>
          <p className="muted">Enter your details to get started with Rent Ease.</p>

          <div className="role-toggle">
            <button
              type="button"
              className={form.role === "tenant" ? "active" : ""}
              onClick={() => setForm((prev) => ({ ...prev, role: "tenant" }))}
            >
              Tenant
            </button>
            <button
              type="button"
              className={form.role === "landlord" ? "active" : ""}
              onClick={() => setForm((prev) => ({ ...prev, role: "landlord" }))}
            >
              Landlord
            </button>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              className="form-input"
              placeholder="Jane Doe"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
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
            {busy ? "Creating account…" : "Create Account →"}
          </button>
          <p className="muted" style={{ marginTop: 16 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
