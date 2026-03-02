require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3001;

app.use("/api/dashboard", dashboardRoutes);

app.use((error, _req, res, _next) => {
  if (error?.message === "Only PDF files are allowed") {
    res.status(400).json({ message: error.message });
    return;
  }

  if (error?.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "PDF must be 15MB or smaller" });
      return;
    }
    res.status(400).json({ message: error.message || "File upload failed" });
    return;
  }

  console.error("Unhandled server error", error);
  res.status(500).json({ message: "Unexpected server error" });
});

app.listen(port, () => console.log("Listening on port " + port));
