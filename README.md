# AgroPath: AI-Powered Plant Pathology & Crop Agronomist Platform

AgroPath is a full-stack, deep-learning agricultural diagnostic platform designed to detect, classify, and prescribe treatments for foliar crop diseases (Potato Early Blight, Late Blight, and Healthy Foliage) in real time.

The platform combines convolutional neural network (CNN) inference, computer vision necrotic segmentation (OpenCV), LLM-powered agronomist advisory (Groq AI API), cloud record persistence (MongoDB Atlas), and an interactive React web application featuring a Meta-inspired design system with dark and light themes.

---

## System Architecture

```
Plant_Disease_Detection/
├── Backend/
│   ├── app.py                     # Flask REST API, Groq LLM engine, MongoDB Atlas client
│   ├── requirements.txt           # Python dependency specifications
│   └── .env                       # API keys and connection strings (Protected)
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx / .css          # Top navigation with theme switch & status
│   │   │   ├── AgronomistChat.jsx / .css  # Groq AI multi-turn agronomist copilot
│   │   │   ├── LesionInspector.jsx / .css # XAI foliar lesion viewer with 2.5x magnifier
│   │   │   ├── DosageCalculator.jsx / .css# Knapsack tank physics mixer & nozzle selector
│   │   │   ├── WeatherRiskCard.jsx / .css # Microclimate disease forecast matrix
│   │   │   ├── CropEncyclopedia.jsx / .css# Diagnostic differential library
│   │   │   ├── ScanHistory.jsx / .css     # Field journal cloud-synced to MongoDB
│   │   │   ├── SpeechVoiceButton.jsx      # Audio readout synthesizer
│   │   │   ├── UploadSection.jsx / .css   # File dropzone & specimen loader
│   │   │   ├── CameraCaptureModal.jsx     # Live webcam foliar capture
│   │   │   └── DiagnosticReportModal.jsx  # Printable agronomic PDF/certificate
│   │   ├── pages/
│   │   │   ├── HomePage.jsx / .css        # Executive dashboard & system overview
│   │   │   ├── DetectPage.jsx / .css      # Foliar diagnostic workbench
│   │   │   ├── WeatherPage.jsx / .css     # Agro-meteorology advisories
│   │   │   ├── CalculatorPage.jsx / .css  # Knapsack sprayer & PPE safety checklist
│   │   │   ├── EncyclopediaPage.jsx / .css# Crop pathology reference guides
│   │   │   └── HistoryPage.jsx / .css     # Cloud field records & CSV exporter
│   │   ├── App.jsx / App.css              # Main application router and design tokens
│   │   └── main.jsx                       # React DOM entry point
│   ├── package.json                       # Frontend dependencies & scripts
│   ├── vite.config.js                     # Vite build configuration
│   └── .env                               # Frontend environment variables
├── models/                                # Deep learning model files
│   ├── potato_disease_detection_model.h5
│   └── potato_disease_detection_model.keras
├── potato_disease_detection_model.json    # Model architecture JSON
├── potato_disease_detection_model_weights.weights.h5 # Model weights
├── Plant_Disease_Detection.ipynb          # Model training notebook
├── requirements.txt                       # Project root dependencies
├── .gitignore                             # Git ignore rules protecting .env
└── README.md                              # Project documentation
```

---

## Key Platform Features

### 1. Foliar Pathology Deep Learning Inference
- Pre-trained Convolutional Neural Network (CNN) trained on high-resolution crop foliage datasets.
- Classifies specimens into **Early Blight (*Alternaria solani*)**, **Late Blight (*Phytophthora infestans*)**, and **Healthy Foliage**.
- Colorimetric computer vision fallback engine using HSV necrotic lesion ratio extraction.

### 2. Explainable AI (XAI) Lesion Inspector
- Interactive **2.5x Zoom Magnifier Loupe** for detailed leaf examination.
- Four diagnostic inspection modes:
  - **Split View:** Real-time before/after wipe slider.
  - **Thermal XAI:** High-contrast pseudo-thermal spectrum mapping.
  - **Heatmap Overlay:** Necrotic density gradient mask.
  - **Hotspot Boxes:** Pathogen spore cluster boundary detection.

### 3. Groq AI Agronomist Copilot (Dr. Flora)
- Multi-turn conversational AI powered by **Groq Cloud LLM** (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`, `qwen/qwen3.8-27b`).
- Zero-dependency HTTPS REST engine ensures immediate execution even in minimal Python environments.
- Automatically contextualizes advice based on the active leaf scan diagnosis and severity metrics.

### 4. Interactive Knapsack Sprayer Simulator
- Physics-based liquid tank fill animation with live volumetric dilution calculations.
- "Agitate & Mix" wave trigger animation for tank suspension verification.
- Integrated nozzle geometry selector (Hollow Cone, Flat Fan, Air Induction).
- PPE Safety Protocol checklist with real-time Safety Readiness Meter.
- One-click "Export Spray Recipe" card.

### 5. MongoDB Atlas Cloud Database
- Automatically records all field scans, severity distributions, and treatment plans in `agropath_db.scans`.
- Archives multi-turn farmer chat sessions in `agropath_db.chat_history`.
- Bi-directional sync with local storage cache and CSV export capabilities.

### 6. Meta-Inspired Design System & Theme Engine
- Clean, professional UI inspired by modern design standards.
- Persistent **Dark Mode / Light Mode** toggle synced to CSS variables.
- Vector SVG icon system without emojis.
- Audio speech synthesis for field voice readout.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS Design System, Web Speech API |
| **Backend** | Python 3.10+, Flask, Flask-CORS, Werkzeug |
| **AI / ML** | TensorFlow 2.x, Keras 3.x, OpenCV (cv2), NumPy, Groq LLM API |
| **Database** | MongoDB Atlas Cloud, PyMongo, Certifi |
| **Environment** | Python-Dotenv, Git, npm |

---

## Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Rajdeep-Mudiar/Plant_Disease_Detection.git
cd Plant_Disease_Detection
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and in `Backend/.env`:

```env
GROQ_API_KEY="your_groq_api_key_here"
MONGO_DB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0"
PORT=5001
```

In `Frontend/.env`:
```env
VITE_API_URL=http://localhost:5001
```

---

### 3. Backend Setup

```bash
cd Backend

# Create and activate virtual environment (optional)
conda create -n plant_disease python=3.10 -y
conda activate plant_disease

# Install required dependencies
pip install -r requirements.txt

# Start the Flask API server
python app.py
```

*Server starts on `http://localhost:5001`.*

---

### 4. Frontend Setup

```bash
cd Frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```

*Frontend starts on `http://localhost:3000`.*

---

## API Documentation

### Foliar Diagnostics
- `POST /predict` — Classify uploaded image file (multipart/form-data).
- `POST /predict_base64` — Classify image payload (JSON base64).
- `GET /classes` — List supported crop pathogen classes.

### AI Agronomist Copilot
- `POST /chat` — Multi-turn conversation with Dr. Flora Groq AI engine.
  ```json
  {
    "message": "What is the recommended dosage for Mancozeb?",
    "history": [],
    "context": { "disease": "Late Blight", "confidence": 94.5 }
  }
  ```

### Cloud Field Journal (MongoDB Atlas)
- `GET /api/history` — Fetch recent scans (supports `limit` and `filter` query params).
- `POST /api/history` — Archive custom field inspection record.
- `DELETE /api/history/clear` — Clear historical scan collection.
- `GET /api/stats` — Aggregate disease outbreak counters.

### System Diagnostics
- `GET /health` — Reports status of TensorFlow, Groq LLM, and MongoDB connections.
- `GET /info` — API metadata, active model versions, and engine specifications.

---

## License

This project is licensed under the MIT License.
