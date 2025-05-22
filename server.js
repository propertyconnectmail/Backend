const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./src/config/database');
const routes = require('./src/routing/route'); 

const archiver = require('archiver');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

//Cors(cross origin request) options are set here
const corsOptions={
    credentials: true, 
    origin:"*",
    //
    //credentials:true,            //access-control-allow-credentials:true
    optionsSuccessStatus:200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


// Middlewares
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cors()); // allow CORS requests
app.use(morgan('dev')); // log HTTP requests

// Connect to MongoDB
connectDB();


app.get('/api/certifications/download-zip', async (req, res) => {
  let urls = req.query.urls;

  // Normalize single vs multiple URL cases
  if (!urls) {
    return res.status(400).json({ message: 'Missing urls parameter' });
  }

  if (typeof urls === 'string') {
    urls = [urls]; // Convert single URL string to array
  }

  if (!Array.isArray(urls)) {
    return res.status(400).json({ message: 'Invalid urls format' });
  }

  res.attachment('certifications.zip');
  const archive = require('archiver')('zip');
  archive.pipe(res);

  const axios = require('axios');

  for (let fileUrl of urls) {
    try {
      const response = await axios.get(fileUrl, { responseType: 'stream' });
      const filename = decodeURIComponent(fileUrl.split('/').pop());
      archive.append(response.data, { name: filename });
    } catch (err) {
      console.error(`Failed to download: ${fileUrl}`, err.message);
    }
  }

  await archive.finalize();
});


// Simple test route
app.get('/', (req, res) => {
    res.send('🏡 Property Connect API is running 🚀');
});

app.use('/static', express.static('Public'));
app.use(routes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global Error Handler (optional, for better error tracking)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something broke on the server!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
