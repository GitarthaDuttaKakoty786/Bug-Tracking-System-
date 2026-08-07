import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Bugs() {
  const [bugs, setBugs] = useState([]);
  const [search, setSearch] = useState("");
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

  async function updateBug(id, field, value) {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/bugs/${id}`,
        {
          [field]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the bug locally so the page changes immediately
      setBugs((currentBugs) =>
        currentBugs.map((bug) =>
          bug._id === id ? { ...bug, [field]: value } : bug
        )
      );
    } catch (error) {
      console.error("Error updating bug:", error);
      alert(error.response?.data?.message || "Could not update bug.");
    }
  }

  async function deleteBug(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/bugs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBugs((currentBugs) => currentBugs.filter((bug) => bug._id !== id));
    } catch (error) {
      console.error("Error deleting bug:", error);

      alert(error.response?.data?.message || "Could not delete bug.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  }

  const filteredBugs = bugs.filter((bug) => {
    const query = search.toLowerCase();

    return (
      bug.title?.toLowerCase().includes(query) ||
      bug.description?.toLowerCase().includes(query) ||
      bug.status?.toLowerCase().includes(query) ||
      bug.severity?.toLowerCase().includes(query) ||
      bug.assignee?.toLowerCase().includes(query)
    );
  });

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
              <Link to="/bugs" className="nav-link active">
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

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1>All Bugs</h1>

            <div className="subtitle">Manage and track all reported bugs</div>
          </div>

          <Link to="/report" className="btn btn-primary">
            + Report Bug
          </Link>
        </div>

        <div className="window">
          <div className="window-titlebar">
            <div className="dots">
              <span className="dot red"></span>
              <span className="dot amber"></span>
              <span className="dot green"></span>
            </div>

            <span className="window-title">bugtrack — all bugs</span>
          </div>

          <div className="window-body">
            {/* SEARCH */}
            <div className="form-field full">
              <label htmlFor="searchInput">Search Bugs</label>

              <input
                id="searchInput"
                type="text"
                placeholder="Search by title, status, severity or assignee..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {/* TABLE */}
            <table className="bug-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBugs.length === 0 ? (
                  <tr>
                    <td colSpan="6">No bugs found.</td>
                  </tr>
                ) : (
                  filteredBugs.map((bug) => (
                    <tr key={bug._id}>
                      <td className="bug-id">{bug._id.slice(-6)}</td>

                      <td>{bug.title}</td>

                      <td>
                        <span className={`badge ${bug.severity}`}>
                          <span className="dot-indicator"></span>
                          {bug.severity}
                        </span>
                      </td>

                      <td>
                        <select
                          className="table-select"
                          value={bug.status}
                          onChange={(event) =>
                            updateBug(bug._id, "status", event.target.value)
                          }
                        >
                          <option value="open">Open</option>

                          <option value="in-progress">In Progress</option>

                          <option value="resolved">Resolved</option>
                        </select>
                      </td>

                      <td>
                        <input
                          className="table-input"
                          type="text"
                          value={bug.assignee || ""}
                          placeholder="Assignee"
                          onChange={(event) => {
                            setBugs((currentBugs) =>
                              currentBugs.map((item) =>
                                item._id === bug._id
                                  ? {
                                      ...item,
                                      assignee: event.target.value,
                                    }
                                  : item
                              )
                            );
                          }}
                          onBlur={(event) =>
                            updateBug(bug._id, "assignee", event.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => deleteBug(bug._id)}
                        >
                          Delete
                        </button>
                      </td>
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

export default Bugs;
