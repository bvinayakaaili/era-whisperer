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

// Era-specific image generation prompts
const ERA_PROMPTS = {
  1900: `Create a detailed image in 1900s Victorian era style. The scene should feature:
    - Sepia tones and muted, vintage coloring
    - Period-appropriate architecture with ornate details, brick buildings, cobblestone streets
    - People dressed in formal Victorian clothing (long coats, top hats, long dresses, corsets)
    - Horse-drawn carriages, early automobiles, gas lamps for lighting
    - Formal, posed composition typical of early photography
    - Soft, diffused lighting reminiscent of early film photography
    - Slightly blurred or grainy texture to simulate old camera quality
    - Industrial revolution elements: steam, factories, railroad tracks
    Scene to generate: `,

  1950: `Create a detailed image in 1950s Golden Age style. The scene should feature:
    - Rich, saturated colors typical of Kodachrome film
    - Mid-century modern architecture with clean lines and geometric shapes
    - 1950s fashion: poodle skirts, letterman jackets, tailored suits, victory rolls hairstyles
    - Classic cars from the era: Cadillacs, Chevrolets with chrome details
    - Diners, drive-ins, suburban neighborhoods with white picket fences
    - Bright, optimistic atmosphere with vibrant signage
    - Rock and roll culture elements: jukeboxes, soda fountains
    - Post-war prosperity and optimism in the composition
    Scene to generate: `,

  2000: `Create a detailed image in 2000s digital era style. The scene should feature:
    - Crisp, digital camera quality with sharp details
    - Y2K aesthetic: metallic surfaces, tech-inspired design
    - Early 2000s fashion: low-rise jeans, flip phones, chunky sneakers
    - Digital technology: early cell phones, computers, CD players
    - Urban environments with modern glass buildings and concrete
    - Bright, saturated colors with high contrast
    - Pop culture elements: MTV generation, internet cafes, video game arcades
    - Clean, contemporary composition with modern lighting
    Scene to generate: `,

  2050: `Create a detailed image in futuristic 2050s style. The scene should feature:
    - Holographic and enhanced digital aesthetics with AR/VR elements
    - Sleek, minimalist architecture with organic curves and sustainable materials
    - Advanced technology seamlessly integrated: floating displays, smart clothing
    - Neon accents and dramatic lighting with bioluminescent elements
    - Futuristic fashion: adaptive clothing, smart fabrics, minimalist designs
    - Flying vehicles, mag-lev transportation, vertical farms
    - Clean energy infrastructure: solar panels, wind turbines, green spaces
    - Enhanced reality effects with subtle sci-fi atmosphere
    Scene to generate: `
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Era Blender API is running' });
});

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { text, era } = req.body;

    // Validate inputs
    if (!text || !era) {
      return res.status(400).json({ 
        error: 'Missing required fields: text and era' 
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

    console.log(`Processing text-to-image generation for era: ${era}`);
    console.log(`Text prompt: "${text}"`);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the full prompt
    const fullPrompt = ERA_PROMPTS[era] + text;
    
    console.log('Sending request to Gemini API...');

    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const description = response.text();
    
    console.log('Generated description:', description);

    // Note: Gemini 1.5 Flash primarily does text generation, not image generation
    // For actual image generation, you would need to integrate with:
    // 1. Google's Imagen API (when available)
    // 2. OpenAI's DALL-E API
    // 3. Stability AI's API
    // 4. Midjourney API
    // 5. Or other image generation services
    
    // For now, we'll return a placeholder response with the enhanced description
    // In production, you would use the description to call an image generation API
    
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

// Text-to-image upload endpoint (alternative to JSON)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const { text, era } = req.body;
    
    if (!text || !era || !ERA_PROMPTS[era]) {
      return res.status(400).json({ 
        error: `Missing required fields: text and era. Supported eras: ${Object.keys(ERA_PROMPTS).join(', ')}` 
      });
    }

    // Process the text for image generation
    const fullPrompt = ERA_PROMPTS[era] + text;
    
    // This would contain the same generation logic as the main endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const description = response.text();
    
    res.json({
      message: 'Text processed successfully',
      imageUrl: `https://picsum.photos/800/600?random=${Date.now()}&era=${era}`, // Placeholder
      description: description,
      era: era,
      originalText: text,
    });

  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).json({ 
      error: 'Failed to process text for image generation',
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