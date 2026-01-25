const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve images

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/scan2clean")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// ✅ image upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ schema
const Request = mongoose.model("Request", {
    name: String,
    email: String,
    phone: String,
    description: String,
    date: String,
    location: String,
    image: String,
    status: { type: String, default: "Pending" }
});

// ✅ add request
app.post("/add-request", upload.single("image"), async (req, res) => {
    await Request.create({
        ...req.body,
        image: req.file ? req.file.filename : ""
    });

    res.json({ message: "Saved successfully" });
});

// ✅ get all requests
app.get("/requests", async (req, res) => {
    const data = await Request.find();
    res.json(data);
});

// ✅ update status
app.put("/update/:id", async (req, res) => {
    await Request.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ message: "Updated" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
