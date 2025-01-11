// Initial Canvas API credentials (Empty until login)
let apiKey = '';
let canvasDomain = '';

// Tab functionality
function openTab(event, tabName) {
  const tabs = document.getElementsByClassName("tab-content");
  for (let tab of tabs) {
    tab.style.display = "none";
  }

  const tabButtons = document.getElementsByClassName("tab-button");
  for (let button of tabButtons) {
    button.style.backgroundColor = "";
  }

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.style.backgroundColor = "#005bb5";
}

// Canvas - Fetch upcoming assignments
async function fetchAssignments() {
  if (!apiKey || !canvasDomain) {
    alert("You need to login first.");
    return;
  }

  const response = await fetch(`https://${canvasDomain}/api/v1/courses/self/assignments`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  console.log(data);
  
  if (data && Array.isArray(data)) {
    const assignmentsList = document.getElementById("assignments-list");
    assignmentsList.innerHTML = '';

    data.forEach(assignment => {
        const listItem = document.createElement("li");
        listItem.textContent = `${assignment.name} - Due: ${assignment.due_at}`;
        assignmentsList.appendChild(listItem);
    });
} else {
    console.error("No assignments found or API response is incorrect");
}
}

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  apiKey = document.getElementById("api-token").value;
  canvasDomain = document.getElementById("canvas-domain").value;

  // Save credentials to local storage for reuse
  localStorage.setItem('canvasApiKey', apiKey);
  localStorage.setItem('canvasDomain', canvasDomain);

  // Hide login page and show main content
  document.getElementById("login-page").style.display = "none";
  document.getElementById("main-content").style.display = "block";

  // Fetch Canvas assignments
  fetchAssignments();
});

// Load saved tokens when opening the "API Tokens" tab
function loadSavedTokens() {
  const canvasToken = localStorage.getItem('canvasApiKey') || '';
  const cleverToken = localStorage.getItem('cleverApiKey') || '';

  document.getElementById('canvas-token').value = canvasToken;
  document.getElementById('clever-token').value = cleverToken;
}

// Handle tokens form submission
document.getElementById("tokens-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const canvasToken = document.getElementById('canvas-token').value;
  const cleverToken = document.getElementById('clever-token').value;

  // Save tokens to local storage
  localStorage.setItem('canvasApiKey', canvasToken);
  localStorage.setItem('cleverApiKey', cleverToken);

  document.getElementById('tokens-status').textContent = 'Tokens saved successfully!';
});

// Home button functionality
function homePage() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("login-page").style.display = "block";
  document.getElementById("api-token").value = '';
  document.getElementById("canvas-domain").value = '';
}

// Load tokens when the "API Tokens" tab is opened
document.querySelector('button[onclick*="openTab(event, \'tokens\')"]').addEventListener('click', loadSavedTokens);
