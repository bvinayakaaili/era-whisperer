# Era Blender (TimeLens) 🕰️✨

Transform any image across different time periods using the power of Google Gemini 2.5 Flash AI. Experience how your photos would look in the 1900s Victorian era, 1950s Golden Age, modern 2000s, or futuristic 2050s.

![Era Blender Demo](src/assets/hero-background.jpg)

## Features 🚀

- **🎨 AI-Powered Transformations**: Uses Google Gemini 2.5 Flash for intelligent image analysis and transformation
- **⏰ Multiple Time Periods**: Transform images to 1900s, 1950s, 2000s, and 2050s aesthetics
- **🖼️ Interactive Comparison**: Side-by-side image comparison with smooth transitions
- **📱 Responsive Design**: Beautiful, modern interface that works on all devices
- **⚡ Real-time Processing**: Fast generation with loading states and error handling
- **💾 Download Support**: Save your transformed images locally

## Tech Stack 📚

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **shadcn/ui** components
- **Lucide React** icons
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **Google Generative AI** (@google/generative-ai)
- **Multer** for file uploads
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

## Quick Start 🏃‍♂️

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone and Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd era-blender

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp server/.env.example server/.env

# Edit the .env file and add your Gemini API key
# server/.env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Run the Application

You need to run both frontend and backend:

```bash
# Terminal 1 - Start the backend server
cd server
npm run dev
# Backend will run on http://localhost:3001

# Terminal 2 - Start the frontend (in a new terminal)
cd ..  # Back to project root
npm run dev
# Frontend will run on http://localhost:8080
```

### 4. Start Creating! 🎨

1. Open http://localhost:8080 in your browser
2. Upload any modern image
3. Use the era slider to transform your image across different time periods
4. Compare results and download your favorites!

## API Endpoints 🔌

### POST `/api/generate`
Transform an image to a specific era.

**Request Body:**
```json
{
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "era": 1950
}
```

**Response:**
```json
{
  "imageUrl": "https://generated-image-url.com/image.jpg",
  "description": "AI description of the transformation",
  "era": 1950,
  "prompt": "The prompt used for transformation"
}
```

### POST `/api/upload`
Alternative endpoint for file uploads.

### GET `/health`
Health check endpoint.

## Supported Eras 📅

| Era | Year | Style Description |
|-----|------|------------------|
| **Victorian** | 1900s | Sepia tones, formal portraits, vintage photography |
| **Golden Age** | 1950s | Kodachrome colors, mid-century modern aesthetic |
| **Digital Era** | 2000s | Crisp digital quality, Y2K aesthetics |
| **Future Vision** | 2050s | Holographic effects, neon accents, sci-fi elements |

## Environment Variables 🔧

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Required |
| `PORT` | Backend server port | 3001 |
| `NODE_ENV` | Environment mode | development |

## Development 🛠️

### Project Structure
```
era-blender/
├── src/
│   ├── components/          # React components
│   │   ├── ImageUploader.tsx
│   │   ├── EraSlider.tsx
│   │   └── ImageComparison.tsx
│   ├── pages/
│   │   └── Index.tsx        # Main application page
│   ├── assets/              # Static assets
│   └── lib/                 # Utilities
├── server/
│   ├── index.js            # Express server
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment template
└── README.md
```

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend:**
```bash
npm run dev          # Start with nodemon (auto-reload)
npm run start        # Start production server
npm run server       # Alternative start command
```

## Troubleshooting 🔍

### Common Issues

**1. "Gemini API key not configured"**
- Make sure you've created `server/.env` file
- Add your actual Gemini API key to the file
- Restart the backend server

**2. "CORS error when calling API"**
- Ensure backend is running on port 3001
- Check that frontend is making requests to the correct URL

**3. "Module not found" errors**
- Run `npm install` in both root directory and `server/` directory
- Delete `node_modules` and reinstall if needed

**4. Image upload not working**
- Check file size (max 10MB)
- Ensure image format is supported (JPEG, PNG)
- Check browser console for detailed errors

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `server/.env` file

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Google Gemini AI for powerful image analysis
- The React and Node.js communities
- shadcn/ui for beautiful component primitives
- All the contributors and testers

---

**Made with ❤️ using Google Gemini 2.5 Flash**

For support or questions, please open an issue on GitHub.