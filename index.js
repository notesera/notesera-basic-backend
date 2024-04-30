const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth'); // Auth routes like signup and login
const dataRoutes = require('./routes/data');
const {notfound,errorhandler}=require('./middleware/errorhandler');
const app = express();

// MongoDB connection
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes); // Use the authentication routes

app.use('/data', dataRoutes);

// Serve static files (frontend build files) if needed
// app.use(express.static('frontend_build_directory'));

// Start the server


// middleware error handlings
app.use(notfound);
app.use(errorhandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
