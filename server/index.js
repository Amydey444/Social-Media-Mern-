// index.js

const express = require("express");
const { connect } = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const upload = require("express-fileupload");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const routes = require("./routes/routes");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true
}));
app.use(upload());

// Test route
app.post("/test", (req, res) => {
  console.log("✅ Test route hit");
  console.log("Request body:", req.body);
  res.send("OK");
});

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
const MONGO = process.env.MONGO_URL;

if (!MONGO) {
  console.error("❌ MONGO_URL not found in .env");
  process.exit(1);
}

console.log("🔌 Trying to connect to MongoDB...");

connect(MONGO)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
