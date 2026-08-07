import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBugs();
  }, []);

  async function loadBugs() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await api.get("/bugs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBugs(response.data);
    } catch (error) {
      console.error("Error loading bugs:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/");
      }
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  }

  const openBugs = bugs.filter((bug) => bug.status === "open").length;
  const progressBugs = bugs.filter((bug) => bug.status === "in-progress").length;
  const resolvedBugs = bugs.filter((bug) => bug.status === "resolved").length;

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
              <Link to="/dashboard" className="nav-link active">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/bugs" className="nav-link">
                All Bugs
              </Link>
            </li>
            <li>
              <Link to="/report" className="nav-link">
                Report Bug
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div>Logged in as {localStorage.getItem("userName") || "User"}</div>
          <button
            className="btn btn-secondary"
            onClick={logout}
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

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <div className="subtitle">Overview of all bugs</div>
          </div>
          <Link to="/report" className="btn btn-primary">
            + Report Bug
          </Link>
        </div>

        {/* DASHBOARD WINDOW */}
        <div className="window">
          <div className="window-titlebar">
            <div className="dots">
              <span className="dot red"></span>
              <span className="dot amber"></span>
              <span className="dot green"></span>
            </div>
            <span className="window-title">bugtrack — dashboard</span>
          </div>

          <div className="window-body">
            {/* STATISTICS */}
            <div className="stats">
              <div className="stat-card critical">
                <div className="label">Open</div>
                <div className="value">{openBugs}</div>
              </div>

              <div className="stat-card progress">
                <div className="label">In Progress</div>
                <div className="value">{progressBugs}</div>
              </div>

              <div className="stat-card resolved">
                <div className="label">Resolved</div>
                <div className="value">{resolvedBugs}</div>
              </div>

              <div className="stat-card">
                <div className="label">Total</div>
                <div className="value">{bugs.length}</div>
              </div>
            </div>

            {/* RECENT BUGS */}
            <div className="section-heading">Recent Bugs</div>

            <table className="bug-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bugs.length === 0 ? (
                  <tr>
                    <td colSpan="4">No bugs reported yet.</td>
                  </tr>
                ) : (
                  bugs.slice(0, 5).map((bug) => (
                    <tr key={bug._id}>
                      <td className="bug-id">{bug._id.slice(-6)}</td>
                      <td>{bug.title}</td>
                      <td>
                        <span className={`badge ${bug.severity}`}>
                          <span className="dot-indicator"></span>
                          {bug.severity}
                        </span>
                      </td>
                      <td>{bug.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
