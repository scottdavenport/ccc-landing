import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/cloudinary/search', async (req, res) => {
  try {
    // Log environment variables for debugging (excluding secrets)
    console.log('Environment check:', {
      hasCloudName: !!process.env.VITE_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.VITE_CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.VITE_CLOUDINARY_API_SECRET,
      nodeEnv: process.env.NODE_ENV
    });

    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials. Available env vars:', Object.keys(process.env));
      throw new Error('Missing Cloudinary credentials');
    }

    console.log('Making Cloudinary API request...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
        },
        body: JSON.stringify({
          expression: 'folder=sponsors',
          max_results: 100
        })
      }
    );
    
    console.log('Cloudinary API response status:', response.status);

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in Cloudinary API route:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
