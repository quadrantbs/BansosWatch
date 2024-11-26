const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("./routes/user");
const reportRoutes = require("./routes/report");
const { errorHandler } = require("./middlewares/errorHandler");
const authenticate = require("./middlewares/auth");
app.get("/", (req, res) => {
  res.send("BansosWatch API");
});

app.use("/users", userRoutes);
app.use("/reports", authenticate, reportRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
