import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URI);
let collection;

async function connectToDB() {
  try {
    await client.connect();
    const db = client.db("logdata"); // Database name
    collection = db.collection("registrations"); // Collection name
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectToDB();

// Handle POST /register
app.post('/register', async (req, res) => {
  const { name, ip, timestamp } = req.body;
  if (!name || !ip || !timestamp) {
    return res.status(400).send("Missing data");
  }

  try {
    await collection.insertOne({ name, ip, timestamp });
    res.send("✅ Registered");
  } catch (err) {
    console.error("❌ Insert failed:", err);
    res.status(500).send("Failed to register");
  }
});

// Handle GET /logs
app.get('/logs', async (req, res) => {
  try {
    const logs = await collection.find().sort({ timestamp: -1 }).toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).send("Error fetching logs");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
