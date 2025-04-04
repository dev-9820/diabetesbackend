import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Schema & Model
const consultationSchema = new mongoose.Schema({
  name: String,
  contact: String,
  place: String,
  duration: String,
});

const Consultation = mongoose.model("Consultation", consultationSchema);

// Routes
app.post("/api/consultations", async (req, res) => {
  try {
    const newConsultation = new Consultation(req.body);
    await newConsultation.save();
    res.status(201).json({ message: "Appointment Booked", data: newConsultation });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }
});

app.get("/api/consultations", async (req, res) => {
  try {
    const data = await Consultation.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

app.delete("/api/consultations/:id", async (req, res) => {
  try {
    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
