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