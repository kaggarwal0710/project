// Initialize Canvas API credentials
let apiKey = '';
let canvasDomain = '';

// Show the selected page (Canvas or Tokens)
function showPage(pageId) {
  // Hide all pages inside #main-content
  document.querySelectorAll('#main-content > div').forEach((page) => {
    page.style.display = 'none';
  });

  // Show the selected page
  document.getElementById(pageId).style.display = 'block';
}

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const userName = document.getElementById("user-name").value.trim();
  if (!userName) {
    document.getElementById("login-status").textContent = "Please enter a valid name.";
    return;
  }

  // Retrieve stored credentials from localStorage
  const userCredentials = JSON.parse(localStorage.getItem('userCredentials')) || {};

  if (userCredentials[userName]) {
    apiKey = userCredentials[userName].apiKey;
    canvasDomain = userCredentials[userName].domain;

    // Hide the login page and show the main content
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-content").style.display = "block";

    // Fetch assignments after login
    fetchAssignments();
  } else {
    document.getElementById("login-status").textContent =
      "No credentials found for this name. Please add them in the 'API Tokens' tab.";
  }
});

// Save user credentials in the "API Tokens" tab
document.getElementById("tokens-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const userName = prompt("Enter the name to associate with these tokens:");
  if (!userName) {
    alert("Name is required to save credentials.");
    return;
  }

  const canvasToken = document.getElementById("canvas-token").value;
  const cleverToken = document.getElementById("clever-token").value;
  const canvasDomain = document.getElementById("canvas-domain").value;

  if (!canvasToken || !canvasDomain) {
    alert("Canvas token and domain are required.");
    return;
  }

  // Save credentials to local storage
  const userCredentials = JSON.parse(localStorage.getItem('userCredentials')) || {};
  userCredentials[userName] = {
    apiKey: canvasToken,
    domain: canvasDomain,
    cleverToken: cleverToken || '',
  };

  localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
  document.getElementById('tokens-status').textContent = 'Tokens saved successfully!';
});

// Fetch assignments from Canvas API
function fetchAssignments() {
  if (!apiKey || !canvasDomain) {
    alert("Missing API credentials. Please log in first.");
    return;
  }

  fetch(`https://${canvasDomain}/api/v1/planner/items`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
    .then((response) => response.json())
    .then((data) => {
      const assignmentsList = document.getElementById("assignments-list");
      assignmentsList.innerHTML = '';
      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.plannable.title} (Due: ${item.plannable.due_at})`;
        assignmentsList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching assignments:", error);
    });
}

// Home button functionality (return to login page)
document.getElementById("home-button").addEventListener("click", function () {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("login-page").style.display = "block";
});
