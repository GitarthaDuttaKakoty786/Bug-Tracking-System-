// function Login() {
//   return (
//     <div>
//       <h1>Login Page</h1>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.name);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Could not reach the server. Is it running?"
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
            bugtrack — login
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
            Welcome back
          </div>

          <div className="login-subtitle">
            Log in to continue tracking bugs
          </div>

          {error && (
            <p className="form-message error show">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin}>

            <div className="form-field full">
              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-field full">
              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
              Log In
            </button>

          </form>

          <div className="login-hint">
            Use your registered email and password
          </div>

          <div className="login-features">
            <span>✓ Bug Reports</span>
            <span>✓ Team Dashboard</span>
            <span>✓ Live Database</span>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <span>Don't have an account? </span>

            <Link to="/register">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
