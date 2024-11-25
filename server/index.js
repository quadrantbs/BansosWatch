const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const userRoutes = require("./routes/user");
const laporanRoutes = require("./routes/laporan");
const { errorHandler } = require("./middlewares/errorHandler");
const authenticate = require("./middlewares/auth");

app.get("/", (req, res) => {
  res.send("BansosWatch API");
});

app.use("/user", userRoutes);
app.use("/laporan", authenticate, laporanRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
