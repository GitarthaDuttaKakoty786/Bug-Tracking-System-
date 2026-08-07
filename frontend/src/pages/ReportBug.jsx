import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ReportBug() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      await api.post(
        "/bugs",
        {
          title,
          description,
          severity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Bug reported successfully!");

      setTitle("");
      setDescription("");
      setSeverity("medium");

      // Go to Bugs page after successful submission
      setTimeout(() => {
        navigate("/bugs");
      }, 700);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/");
        return;
      }

      setError(error.response?.data?.message || "Could not report the bug.");
    }
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span className="bracket">&lt;/&gt;</span> BugTrack
        </div>

        <nav>
          <div className="nav-group-label">Menu</div>
          <ul>
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/bugs" className="nav-link">
                All Bugs
              </Link>
            </li>
            <li>
              <Link to="/report" className="nav-link active">
                Report Bug
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div>Logged in as {localStorage.getItem("userName") || "User"}</div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              navigate("/");
            }}
            style={{
              marginTop: "10px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Report Bug</h1>
            <div className="subtitle">Create a new bug report</div>
          </div>
        </div>

        <div className="window">
          <div className="window-titlebar">
            <div className="dots">
              <span className="dot red"></span>
              <span className="dot amber"></span>
              <span className="dot green"></span>
            </div>
            <span className="window-title">bugtrack — report bug</span>
          </div>

          <div className="window-body">
            <form onSubmit={handleSubmit}>
              {/* TITLE */}
              <div className="form-field full">
                <label htmlFor="bugTitle">Bug Title</label>
                <input
                  type="text"
                  id="bugTitle"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter bug title"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-field full">
                <label htmlFor="bugDescription">Description</label>
                <textarea
                  id="bugDescription"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the bug..."
                  rows="6"
                  required
                />
              </div>

              {/* SEVERITY */}
              <div className="form-field full">
                <label>Severity</label>
                <div className="severity-options">
                  <label>
                    <input
                      type="radio"
                      name="severity"
                      value="low"
                      checked={severity === "low"}
                      onChange={(event) => setSeverity(event.target.value)}
                    />
                    Low
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="severity"
                      value="medium"
                      checked={severity === "medium"}
                      onChange={(event) => setSeverity(event.target.value)}
                    />
                    Medium
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="severity"
                      value="high"
                      checked={severity === "high"}
                      onChange={(event) => setSeverity(event.target.value)}
                    />
                    High
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="severity"
                      value="critical"
                      checked={severity === "critical"}
                      onChange={(event) => setSeverity(event.target.value)}
                    />
                    Critical
                  </label>
                </div>
              </div>

              {/* ERROR */}
              {error && <p className="form-message error show">{error}</p>}

              {/* SUCCESS */}
              {message && <p className="form-message success show">{message}</p>}

              {/* BUTTON */}
              <button type="submit" className="btn btn-primary">
                Submit Bug
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportBug;
