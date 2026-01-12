# Plant Disease Detection - React Frontend

React frontend for potato disease detection using the Flask backend API.

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Create `.env` file:**

```bash
REACT_APP_API_URL=http://localhost:5000
```

3. **Start development server:**

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PredictorCard.jsx       # Main prediction component
│   │   └── PredictorCard.css       # Component styles
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── public/
├── package.json
└── .env
```

## Features

- 📸 Image upload with preview
- 🔍 Real-time disease prediction
- 📊 Confidence score visualization
- 💡 Disease-specific recommendations
- 🎨 Modern, responsive UI
- ⚡ Fast inference with backend API

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Backend Startup

Make sure the Flask backend is running:

```bash
cd ../backend
pip install -r requirements.txt
python app.py
```

The backend will be available at `http://localhost:5000`

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm build`

Builds the app for production to the `build` folder.

### `npm test`

Runs the test suite.

## Component Usage

```jsx
import PredictorCard from "./components/PredictorCard";

function App() {
  return (
    <div>
      <PredictorCard />
    </div>
  );
}

export default App;
```

## API Integration

The PredictorCard component communicates with the backend API:

- **Endpoint:** `POST /predict`
- **Request:** FormData with image file
- **Response:** JSON with prediction, confidence, and guidance

## Building for Production

```bash
npm run build
```

This creates a production build in the `build` folder, optimized for performance.

## Troubleshooting

### CORS Errors

Make sure the Flask backend has CORS enabled (already configured in `app.py`).

### API Connection Issues

Check that:

1. Backend is running on `http://localhost:5000`
2. `REACT_APP_API_URL` environment variable is set correctly
3. Backend port (5000) is not blocked by firewall

### Image Upload Issues

Supported formats: PNG, JPG, JPEG, GIF
Maximum size: 10MB

## Technologies Used

- React 18
- Fetch API
- CSS3
- Flask (backend)
- TensorFlow/Keras (model)
