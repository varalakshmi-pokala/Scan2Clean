// ===============================
// Imports
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();


// ===============================
// Middlewares
// ===============================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded images


// ===============================
// MongoDB Connection
// ===============================

// 👉 Uses Render ENV first
// 👉 Falls back to local for laptop testing

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/scan2clean";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));


// ===============================
// Multer (Image Upload)
// ===============================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ===============================
// Schema & Model
// ===============================
const requestSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    description: String,
    date: String,
    location: String,
    image: String,
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);


// ===============================
// Routes
// ===============================

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Cash for Trash Backend Running");
});


// ✅ Add Request
app.post("/add-request", upload.single("image"), async (req, res) => {
  try {
    const newRequest = await Request.create({
      ...req.body,
      image: req.file ? req.file.filename : "",
    });

    res.json({ message: "Saved successfully", data: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get all requests
app.get("/requests", async (req, res) => {
  try {
    const data = await Request.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Update status
app.put("/update/:id", async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🔥 Server running on port ${PORT}`)
);
app.get("/", (req, res) => {
    res.send("🚀 Scan2Clean Backend Running Successfully");
});

