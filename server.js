const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the 'build' folder (assuming your build output folder is 'build')
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the main HTML file for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
