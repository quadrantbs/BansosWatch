const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
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
const apiDocs = require("./view/htmlContent");
app.get("/", apiDocs);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/reports", authenticate, reportRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
