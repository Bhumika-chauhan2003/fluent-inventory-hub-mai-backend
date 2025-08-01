const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const route= require('./src/routes/route'); // renamed for clarity

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventorydb';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(`✅ MongoDB connected to: ${MONGODB_URI}`))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api', route); // All routes under /api

// Root test route
app.get('/api', (req, res) => {
  res.send('Hello from Express + MongoDB backend!');
});

// CORS error handler
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(400).json({ error: 'CORS error' });
  }

  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
