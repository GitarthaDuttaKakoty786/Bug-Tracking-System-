// ============ 1. LOGIN ============
// Runs only on login.html, because loginForm only exists there
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stops the page from reloading on submit

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("loginError");

    // Hardcoded demo check — no backend, just for the evaluation
    if (email === "demo@bugtrack.com" && password === "demo123") {
      localStorage.setItem("loggedIn", "true"); // remembers login across pages
      window.location.href = "index.html";
    } else {
      errorBox.textContent = "Invalid email or password.";
      errorBox.classList.add("show");
    }
  });
}

// ============ 2. PROTECT PAGES + LOGOUT ============
// Call requireLogin() at the top of any page that needs a logged-in user
function requireLogin() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

// ============ 3. SEARCH FILTER (bugs.html) ============
// Runs only if a search box with id="searchInput" exists on the page
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll(".bug-table tbody tr");

    rows.forEach(function (row) {
      const rowText = row.textContent.toLowerCase();
      row.style.display = rowText.includes(query) ? "" : "none";
    });
  });
}

// ============ REPORT BUG FORM ============
const reportForm = document.getElementById("reportForm");

if (reportForm) {
  reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bugs = JSON.parse(localStorage.getItem("bugs")) || [];

    const severityInput = document.querySelector('input[name="severity"]:checked');
    const severity = severityInput ? severityInput.id.replace("sev-", "") : "medium";

    const newBug = {
      id: "BUG-" + Math.floor(1000 + Math.random() * 9000),
      title: document.getElementById("bugTitle").value,
      description: document.getElementById("bugDescription").value,
      severity: severity,
      status: "open",
      date: new Date().toLocaleDateString()
    };

    bugs.push(newBug);
    localStorage.setItem("bugs", JSON.stringify(bugs));

    window.location.href = "bugs.html";
  });
}

// ============ STARTER BUGS (only added once, first time ever) ============
function seedBugs() {
  const existing = localStorage.getItem("bugs");
  if (existing) return; // already has data — don't overwrite it

  const starterBugs = [
    { id: "BUG-1001", title: "Login button unresponsive on Safari", severity: "critical", status: "open", date: "7/20/2026" },
    { id: "BUG-1002", title: "Dashboard chart overflows on mobile", severity: "high", status: "open", date: "7/21/2026" },
    { id: "BUG-1003", title: "Typo in email notification subject", severity: "low", status: "resolved", date: "7/22/2026" }
  ];

  localStorage.setItem("bugs", JSON.stringify(starterBugs));
}

seedBugs(); // run this first, so there's data before renderBugs() reads it

// ============ DISPLAY SAVED BUGS ============
function renderBugs() {
  const tbody = document.getElementById("bugsTableBody");
  if (!tbody) return; // only run this on bugs.html

  const bugs = JSON.parse(localStorage.getItem("bugs")) || [];

  bugs.forEach(function (bug) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="bug-id">${bug.id}</td>
      <td class="bug-title-cell">${bug.title}</td>
      <td><span class="badge ${bug.severity}"><span class="dot-indicator"></span>${bug.severity}</span></td>
      <td><span class="badge status-open">${bug.status}</span></td>
      <td>${bug.date}</td>
      <td><button class="btn btn-secondary" onclick="deleteBug('${bug.id}')">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

renderBugs(); // runs as soon as script.js loads on bugs.html