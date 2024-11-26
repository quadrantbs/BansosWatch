const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { marked } = require("marked");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const reportRoutes = require("./routes/report");

const { errorHandler } = require("./middlewares/errorHandler");
const authenticate = require("./middlewares/auth");
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "API Docs.md");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading the file");
    }

    const htmlContent = marked(data);

    res.send(`
      <html>
        <head>
          <title>Bansos Watch - API Docs</title>
        </head>
        <body>
          <div>${htmlContent}</div>
        </body>
      </html>
    `);
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/reports", authenticate, reportRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
