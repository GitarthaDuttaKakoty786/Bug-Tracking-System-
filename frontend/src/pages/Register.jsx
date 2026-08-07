import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Could not reach the server."
      );
    }
  }

  return (
    <div className="login-page">
      <div className="window login-window">

        <div className="window-titlebar">
          <div className="dots">
            <span className="dot red"></span>
            <span className="dot amber"></span>
            <span className="dot green"></span>
          </div>

          <span className="window-title">
            bugtrack — register
          </span>
        </div>

        <div className="window-body">

          <div className="login-badge">
            &lt;/&gt;
          </div>

          <div className="login-logo">
            BugTrack
          </div>

          <div className="login-heading">
            Create account
          </div>

          <div className="login-subtitle">
            Create an account to start tracking bugs
          </div>

          {error && (
            <p className="form-message error show">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister}>

            <div className="form-field full">
              <label htmlFor="name">Name</label>

              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field full">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field full">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              Create Account
            </button>

          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <span>Already have an account? </span>

            <Link to="/">
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
