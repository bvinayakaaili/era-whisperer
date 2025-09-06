const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Era transformation prompts
const ERA_PROMPTS = {
  1900: `Transform this image to look like it was taken in the 1900s Victorian era. Apply:
    - Sepia tones and vintage coloring
    - Formal, posed composition typical of early photography
    - Soft, diffused lighting reminiscent of early film photography
    - Slightly blurred or grainy texture
    - Formal clothing and accessories from the 1900s period
    - Ornate backgrounds or simple studio settings
    - Maintain the original subject and scene composition`,

  1950: `Transform this image to look like it was taken in the 1950s Golden Age. Apply:
    - Rich, saturated colors typical of Kodachrome film
    - Classic mid-century modern aesthetic
    - Clean, optimistic styling
    - 1950s fashion, hairstyles, and design elements
    - Bright, well-lit photography style
    - Vintage cars, architecture, and objects from the era
    - Maintain the original subject and scene composition`,

  2000: `Transform this image to look like it was taken in the 2000s digital era. Apply:
    - Crisp, digital camera quality
    - Bright, saturated colors
    - Modern lighting and composition
    - Y2K-era fashion and technology
    - Digital photography aesthetics
    - Contemporary urban or suburban settings
    - Maintain the original subject and scene composition`,

  2050: `Transform this image to look like it could be from the 2050s future. Apply:
    - Holographic and enhanced digital aesthetics
    - Neon accents and futuristic lighting
    - Advanced technology integration
    - Sleek, minimalist futuristic design
    - Enhanced reality effects
    - Futuristic fashion and environments
    - Subtle sci-fi elements
    - Maintain the original subject and scene composition`
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Era Blender API is running' });
});

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { imageUrl, era } = req.body;

    // Validate inputs
    if (!imageUrl || !era) {
      return res.status(400).json({ 
        error: 'Missing required fields: imageUrl and era' 
      });
    }

    if (!ERA_PROMPTS[era]) {
      return res.status(400).json({ 
        error: `Unsupported era: ${era}. Supported eras: ${Object.keys(ERA_PROMPTS).join(', ')}` 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured' 
      });
    }

    console.log(`Processing image transformation for era: ${era}`);

    // Convert base64 image to buffer
    let imageBuffer;
    try {
      // Remove data URL prefix if present
      const base64Data = imageUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid image format. Please provide a valid base64 image.' 
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt and image for Gemini
    const prompt = ERA_PROMPTS[era];
    
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: 'image/jpeg', // Assuming JPEG, could be made dynamic
      },
    };

    console.log('Sending request to Gemini API...');

    // Generate content with Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    // Note: Gemini 1.5 Flash primarily does text generation
    // For actual image generation, we would need a different approach
    // This is a placeholder that would work with actual image generation APIs
    
    // For now, we'll return a descriptive response
    const text = response.text();
    
    // In a real implementation, you would:
    // 1. Use a different AI service for image generation (like DALL-E, Midjourney API, etc.)
    // 2. Or use Gemini's image understanding to create detailed prompts for another image generator
    // 3. Or implement a pipeline that combines multiple services
    
    console.log('Generated description:', text);

    // Placeholder response - in real implementation, this would be the generated image URL
    res.json({
      imageUrl: imageUrl, // Returning original for now
      description: text,
      era: era,
      prompt: prompt,
      message: 'Note: This is a demo response. In production, this would return the actual transformed image.',
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    let errorMessage = 'Failed to generate image transformation';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid or missing Gemini API key';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// File upload endpoint (alternative to base64)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { era } = req.body;
    
    if (!era || !ERA_PROMPTS[era]) {
      return res.status(400).json({ 
        error: `Invalid era: ${era}. Supported eras: ${Object.keys(ERA_PROMPTS).join(', ')}` 
      });
    }

    // Convert buffer to base64 for processing
    const base64Image = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // Process the same way as the main endpoint
    // This would contain the same logic as above
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      era: era,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload and process image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/generate',
      'POST /api/upload'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Era Blender API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 Generate endpoint: http://localhost:${PORT}/api/generate`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
    console.warn('   Please add your Gemini API key to the .env file');
  } else {
    console.log('✅ Gemini API key configured');
  }
});