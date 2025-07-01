import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
  const { name, ip, timestamp } = req.body;
  const entry = `${timestamp} | ${name} | ${ip}\n`;

  fs.appendFile('logs.txt', entry, err => {
    if (err) {
      console.error('Log write failed:', err);
      return res.status(500).send('Server Error');
    }
    res.send('Registered');
  });
});

app.get('/', (req, res) => {
  res.send('API is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
