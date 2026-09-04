const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Inquiry = require("./models/Inquiry");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  })
);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vexorux";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✓ MongoDB Connected Successfully"))
  .catch((err) => console.error("✕ MongoDB Connection Error:", err.message));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Create New Inquiry / Project Brief
app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, email, company, projectType, budget, timeline, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message details are required."
      });
    }

    // Save to Database
    const newInquiry = await Inquiry.create({
      name,
      email,
      company: company || "",
      projectType: projectType || "Bespoke Business Website",
      budget: budget || "Flexible",
      timeline: timeline || "Flexible",
      message,
      source: source || "contact_form"
    });

    console.log(`[New Lead] From: ${name} (${email}) | Type: ${projectType} | Budget: ${budget}`);

    res.status(201).json({
      success: true,
      message: "Inquiry received successfully. We will reach out within 24 hours.",
      data: {
        id: newInquiry._id,
        createdAt: newInquiry.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Please try again or contact via WhatsApp/Email."
    });
  }
});

// Admin Route: Get all inquiries (Protected by simple API Secret Key)
app.get("/api/inquiries", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== (process.env.ADMIN_SECRET_KEY || "vexor_admin_secret_2026")) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 VexorUX Server running on http://localhost:${PORT}`);
});
