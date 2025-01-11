const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all origins (You can customize this)
app.use(cors());

// Endpoint to fetch Canvas assignments
app.get('/api/assignments', async (req, res) => {
  const { canvasDomain, apiKey } = req.query;

  try {
    // Make the request to the Canvas API
    const response = await axios.get(`https://${canvasDomain}/api/v1/planner/items`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    // Send the assignments data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Canvas assignments:', error);
    res.status(500).json({ error: 'Unable to fetch assignments' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
