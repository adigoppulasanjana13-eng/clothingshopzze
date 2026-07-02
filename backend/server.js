const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load env variables
dotenv.config();

let dbConnectionPromise = null;
const getDatabaseConnection = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
};

// Connect to database
if (!(process.env.VERCEL && !process.env.MONGO_URI)) {
  getDatabaseConnection();
}

const app = express();

// Body parsers & CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');

// Database status check middleware for API requests
app.use('/api', async (req, res, next) => {
  // 1. If running on Vercel and no URI is defined, fail fast immediately
  if (process.env.VERCEL && !process.env.MONGO_URI) {
    return res.status(503).json({
      success: false,
      message: 'Database is offline. Please configure the MONGO_URI environment variable in your Vercel settings.'
    });
  }

  // 2. Await connection and seeding completion
  try {
    await getDatabaseConnection();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please check your database settings.'
    });
  }

  // 3. Double check if connection is active
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is offline. Please check your database settings.'
    });
  }
  next();
});

// API Routes

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle direct browser hits on SPA routes or other subpages gracefully
app.get('*', (req, res, next) => {
  // If the path looks like an API call, don't serve index.html, let Express handle it or hit error handler
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
