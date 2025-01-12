// Function to show the selected tab
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.style.display = tab.id === tabName ? 'block' : 'none';
  });
}

// Function to fetch and display Canvas assignments from iCal feed
async function loadCanvasAssignments() {
  const feedURL = document.getElementById('canvasFeedURL').value.trim();
  if (!feedURL) {
    alert("Please enter your Canvas Calendar Feed URL.");
    return;
  }

  try {
    const response = await fetch(feedURL);
    const icalText = await response.text();
    const parsedEvents = parseICS(icalText);
    displayAssignments(parsedEvents);
  } catch (error) {
    console.error("Error fetching Canvas calendar feed:", error);
    alert("There was an error fetching the Canvas calendar feed.");
  }
}

// Function to parse the iCal feed (ICS format)
function parseICS(icsData) {
  const events = [];
  const lines = icsData.split('\n');
  let event = {};
  
  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('BEGIN:VEVENT')) {
      event = {};
    } else if (line.startsWith('SUMMARY:')) {
      event.title = line.replace('SUMMARY:', '').trim();
    } else if (line.startsWith('DTSTART:')) {
      event.startDate = line.replace('DTSTART:', '').trim();
    } else if (line.startsWith('DTEND:')) {
      event.endDate = line.replace('DTEND:', '').trim();
    } else if (line.startsWith('DESCRIPTION:')) {
      event.description = line.replace('DESCRIPTION:', '').trim();
    } else if (line.startsWith('END:VEVENT')) {
      events.push(event);
    }
  });

  return events;
}

// Function to display parsed Canvas assignments
function displayAssignments(events) {
  const assignmentsList = document.getElementById('assignmentsList');
  assignmentsList.innerHTML = ""; // Clear existing assignments

  if (events.length === 0) {
    assignmentsList.innerHTML = "<p>No upcoming assignments found.</p>";
    return;
  }

  const list = document.createElement('ul');
  
  events.forEach(event => {
    const listItem = document.createElement('li');
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    listItem.innerHTML = `
      <strong>${event.title}</strong><br>
      <small>Start: ${startDate.toLocaleString()}<br>
      End: ${endDate.toLocaleString()}</small><br>
      <p>${event.description || 'No description available'}</p>
    `;
    
    list.appendChild(listItem);
  });

  assignmentsList.appendChild(list);
}
