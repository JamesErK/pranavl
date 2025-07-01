import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual MongoDB connection URI
const uri = 'mongodb+srv://youruser:yourpass@cluster0.mongodb.net/logdata?retryWrites=true&w=majority';

const client = new MongoClient(uri);
let collection;

async function connectToDB() {
  try {
    await client.connect();
    const db = client.db('logdata'); // Your database name
    collection = db.collection('registrations'); // Your collection name
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}
connectToDB();

// POST /register → saves name, ip, and timestamp
app.post('/register', async (req, res) => {
  const { name, ip, timestamp } = req.body;

  if (!name || !ip || !timestamp) {
    return res.status(400).send('❌ Missing required fields');
  }

  try {
    await collection.insertOne({ name, ip, timestamp });
    res.send('✅ Registration saved to database');
  } catch (err) {
    console.error('❌ Error inserting into MongoDB:', err);
    res.status(500).send('Server error');
  }
});

// GET /logs → fetch all logs
app.get('/logs', async (req, res) => {
  try {
    const logs = await collection.find().sort({ timestamp: -1 }).toArray();
    res.json(logs);
  } catch (err) {
    console.error('❌ Error fetching logs:', err);
    res.status(500).send('Error fetching logs');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('🚀 MongoDB logger server is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
