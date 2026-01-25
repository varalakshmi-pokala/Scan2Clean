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
app.use("/uploads", express.static("uploads"));


// ✅ Serve frontend (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "../public")));


// ===============================
// MongoDB Connection
// ===============================
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/scan2clean";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));


// ===============================
// Multer setup
// ===============================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


// ===============================
// Schema
// ===============================
const Request = mongoose.model("Request", {
  name: String,
  email: String,
  phone: String,
  description: String,
  date: String,
  location: String,
  image: String,
  status: { type: String, default: "Pending" },
});


// ===============================
// Routes
// ===============================

// ⭐ Serve homepage HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


// Add request
app.post("/add-request", upload.single("image"), async (req, res) => {
  const newRequest = await Request.create({
    ...req.body,
    image: req.file ? req.file.filename : "",
  });

  res.json({ message: "Saved successfully", data: newRequest });
});


// Get all
app.get("/requests", async (req, res) => {
  const data = await Request.find().sort({ createdAt: -1 });
  res.json(data);
});


// Update
app.put("/update/:id", async (req, res) => {
  await Request.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  res.json({ message: "Updated" });
});


// ===============================
// Start Server (LAST ALWAYS)
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on ${PORT}`);
});
