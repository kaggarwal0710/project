// Initialize Canvas API credentials
let apiKey = '';
let canvasDomain = '';

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const userName = document.getElementById("user-name").value.trim();
  if (!userName) {
    document.getElementById("login-status").textContent = "Please enter a valid name.";
    return;
  }

  // Check local storage for the user's API token and domain
  const userCredentials = JSON.parse(localStorage.getItem('userCredentials')) || {};
  if (userCredentials[userName]) {
    apiKey = userCredentials[userName].apiKey;
    canvasDomain = userCredentials[userName].domain;

    document.getElementById("login-status").textContent = '';
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

// Home button functionality
function homePage() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("login-page").style.display = "block";
  document.getElementById("user-name").value = '';
  document.getElementById("login-status").textContent = '';
}
