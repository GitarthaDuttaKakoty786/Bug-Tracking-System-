// ============ CONFIG ============
const API_BASE = "http://localhost:5000/api";

// ============ AUTH GUARD (runs on every protected page) ============
function requireLogin() {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

// Fills in "Logged in as ..." in the sidebar, if that element exists
function showSidebarUser() {
  const el = document.getElementById("sidebarUser");
  if (el) el.textContent = "Logged in as " + (localStorage.getItem("userName") || "User");
}

// ============ LOGIN ============
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("loginError");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        errorBox.textContent = data.message;
        errorBox.classList.add("show");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      window.location.href = "index.html";
    } catch (err) {
      errorBox.textContent = "Could not reach the server. Is it running?";
      errorBox.classList.add("show");
    }
  });
}

// ============ SIGNUP ============
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("signupError");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorBox.textContent = data.message;
        errorBox.classList.add("show");
        return;
      }

      alert("Registration Successful! Please login.");

      window.location.href = "login.html";

    } catch (err) {
      errorBox.textContent = "Could not reach the server.";
      errorBox.classList.add("show");
    }
  });
}

// ============ FETCH BUGS FROM THE DATABASE ============
async function getBugs() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/bugs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

// Builds one <tr> for a bug. `editable` controls whether status/assignee/delete show
// (used on bugs.html) or just plain text (used on the dashboard's "Recent Bugs" list).
function buildBugRow(bug, editable) {
  const row = document.createElement("tr");

  if (editable) {
    row.innerHTML = `
      <td class="bug-id">${bug._id.slice(-6)}</td>
      <td>${bug.title}</td>
      <td><span class="badge ${bug.priority}"><span class="dot-indicator"></span>${bug.priority}</span></td>
      <td>
        <select class="table-select" onchange="updateBugField('${bug._id}', 'status', this.value)">
          <option value="Open" ${bug.status === "Open" ? "selected" : ""}>Open</option>
          <option value="In Progress"  ${bug.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${bug.status === "Resolved"? "selected" : ""}>Resolved</option>
        </select>
      </td>
      <td>
        <input class="table-input" type="text" value="${bug.assignee || ""}"
          onchange="updateBugField('${bug._id}', 'assignee', this.value)">
      </td>
      <td><button class="btn btn-secondary" onclick="deleteBug('${bug._id}')">Delete</button></td>
    `;
  } else {
    row.innerHTML = `
      <td class="bug-id">${bug._id.slice(-6)}</td>
      <td>${bug.title}</td>
      <td><span class="badge ${bug.priority}"><span class="dot-indicator"></span>${bug.priority}</span></td>
      <td>${bug.status}</td>
    `;
  }

  return row;
}

// ============ BUGS PAGE ============
async function renderBugsPage() {
  const tbody = document.getElementById("bugsTableBody");
  if (!tbody) return; // only run on bugs.html

  const bugs = await getBugs();
  tbody.innerHTML = "";
  bugs.forEach((bug) => tbody.appendChild(buildBugRow(bug, true)));
}

// ============ DASHBOARD PAGE ============
async function renderDashboard() {
  const tbody = document.getElementById("recentBugsBody");
  if (!tbody) return; // only run on index.html

  const bugs = await getBugs();

  document.getElementById("statTotal").textContent = bugs.length;
  document.getElementById("statOpen").textContent = bugs.filter((b) => b.status === "Open").length;
  document.getElementById("statProgress").textContent = bugs.filter((b) => b.status === "In Progress").length;
  document.getElementById("statResolved").textContent = bugs.filter((b) => b.status === "Resolved").length;

  tbody.innerHTML = "";
  bugs.slice(0, 5).forEach((bug) => tbody.appendChild(buildBugRow(bug, false)));
}

// ============ UPDATE (status / assignee) ============
async function updateBugField(id, field, value) {
  const token = localStorage.getItem("token");
  await fetch(`${API_BASE}/bugs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ [field]: value }),
  });
}

// ============ DELETE ============
async function deleteBug(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API_BASE}/bugs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  renderBugsPage();
}

// ============ REPORT BUG FORM ============
const reportForm = document.getElementById("reportForm");

if (reportForm) {
  reportForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const severityInput = document.querySelector('input[name="severity"]:checked');
    const severity = severityInput ? severityInput.id.replace("sev-", "") : "medium";
    const token = localStorage.getItem("token");
    const messageBox = document.getElementById("reportMessage");

    try {
      const res = await fetch(`${API_BASE}/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: document.getElementById("bugTitle").value,
          description: document.getElementById("bugDescription").value,
          priority:
            severity.charAt(0).toUpperCase() +
            severity.slice(1).toLowerCase(),
          status: "Open",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        messageBox.textContent = data.message;
        messageBox.className = "form-message error show";
        return;
      }

      window.location.href = "bugs.html";
    } catch (err) {
      messageBox.textContent = "Could not reach the server.";
      messageBox.className = "form-message error show";
    }
  });
}

// ============ SEARCH FILTER ============
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#bugsTableBody tr").forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  });
}

// ============ RUN ON PAGE LOAD ============
// login.html has none of these ids, so all of this safely does nothing there
if (!loginForm && !signupForm)  {
  requireLogin();
  showSidebarUser();
  renderDashboard();
  renderBugsPage();
}