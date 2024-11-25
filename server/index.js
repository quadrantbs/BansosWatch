const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('BansosWatch API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
