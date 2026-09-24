# AgroPath: AI-Powered Plant Pathology & Digital Farm Intelligence Platform

AgroPath is an enterprise-grade agricultural computer vision, digital twin, and pathology diagnostic platform designed to detect, classify, simulate, and prescribe treatments for foliar crop diseases in real time.

The platform unifies deep learning convolutional neural network (CNN) inference, explainable AI (XAI) lesion heatmaps, LLM-powered multilingual agronomist voice advisory (Groq AI), a real-time **Digital Farm Twin & IoT Simulation Hub**, geospatial GIS outbreak mapping, chemical safety countdown timers, economic yield loss forecasting, and cloud record synchronization (MongoDB Atlas) in a sleek Meta/Linear-inspired dark and light theme interface.

---

## System Architecture

```
Plant_Disease_Detection/
├── Backend/
│   ├── app.py                          # Flask REST API, dynamic Groq LLM engine, MongoDB Atlas client
│   ├── requirements.txt                # Python backend dependencies
│   └── .env                            # API keys & connection strings (Protected)
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx / .css               # Top navigation with theme toggle & status indicators
│   │   │   ├── AgronomistChat.jsx / .css       # Multilingual voice agronomist copilot (9 languages)
│   │   │   ├── CropRecoveryTracker.jsx / .css  # 4-stage crop healing roadmap & healing index
│   │   │   ├── FarmOutbreakMap.jsx / .css      # Leaflet GIS geospatial outbreak heatmap & spore radius
│   │   │   ├── SafetyCountdownTimer.jsx / .css # Pre-Harvest Interval (PHI) & REI safety countdown
│   │   │   ├── EconomicsLossEstimator.jsx / .css # Farm financial yield loss & fungicide ROI estimator
│   │   │   ├── WorkerDispatchModal.jsx / .css  # 1-Click WhatsApp & SMS field crew directive dispatcher
│   │   │   ├── CropSelector.jsx / .css         # Multi-crop diagnostic target engine switcher
│   │   │   ├── LesionInspector.jsx / .css      # Explainable AI (XAI) lesion loupe & segmentation viewer
│   │   │   ├── DosageCalculator.jsx / .css     # Knapsack sprayer tank physics mixer & nozzle selector
│   │   │   ├── WeatherRiskCard.jsx / .css      # Microclimate disease forecast matrix
│   │   │   ├── CropEncyclopedia.jsx / .css     # Pathogen differential encyclopedia
│   │   │   ├── ScanHistory.jsx / .css          # Field journal cloud-synced to MongoDB Atlas
│   │   │   ├── SpeechVoiceButton.jsx           # Natural audio speech readout synthesizer
│   │   │   ├── UploadSection.jsx / .css        # File dropzone & specimen loader
│   │   │   ├── CameraCaptureModal.jsx          # Live camera foliar capture
│   │   │   └── DiagnosticReportModal.jsx       # Printable agronomic PDF certificate generator
│   │   ├── pages/
│   │   │   ├── HomePage.jsx / .css             # Executive dashboard & system overview
│   │   │   ├── DetectPage.jsx / .css           # Foliar diagnostic scanner workbench
│   │   │   ├── DigitalTwinPage.jsx / .css      # Real-time Digital Farm Twin & IoT simulation hub
│   │   │   ├── WeatherPage.jsx / .css          # Agro-meteorology radar & GIS outbreak map
│   │   │   ├── CalculatorPage.jsx / .css       # Knapsack sprayer, PHI safety timer & economics
│   │   │   ├── EncyclopediaPage.jsx / .css     # Multi-crop pathology reference guides
│   │   │   └── HistoryPage.jsx / .css          # Cloud field records & CSV exporter
│   │   ├── App.jsx / App.css                   # Main application router and theme design tokens
│   │   └── main.jsx                            # React DOM entry point
│   ├── package.json                            # Frontend dependencies & scripts
│   ├── vite.config.js                          # Vite bundler configuration
│   └── .env                                    # Frontend environment variables
├── models/                                     # Deep learning model files
│   ├── potato_disease_detection_model.h5
│   └── potato_disease_detection_model.keras
├── potato_disease_detection_model.json         # Model architecture JSON
├── potato_disease_detection_model_weights.weights.h5 # Model weights
├── Plant_Disease_Detection.ipynb               # Model training notebook
├── requirements.txt                            # Project root dependencies
├── .gitignore                                  # Git ignore rules protecting environment files
└── README.md                                   # Platform documentation
```

---

## Key Platform Features

### 1. Foliar Pathology Deep Learning Inference
- Pre-trained Convolutional Neural Network (CNN) classifying foliar specimens into **Early Blight (*Alternaria solani*)**, **Late Blight (*Phytophthora infestans*)**, and **Healthy Foliage**.
- Micro-morphological spatial feature extraction with confidence probability breakdown.
- Colorimetric computer vision fallback engine using HSV necrotic lesion ratio extraction.

### 2. Digital Farm Twin & Real-Time IoT Simulation Hub
- **6-Sector Biophysical Matrix:** North Drip Pivot, Greenhouse Alpha, Central Valley Ridge, East Hillside Terrace, South River Basin, and West Orchard Block.
- **Simulated IoT Telemetry Stream:** Soil volumetric moisture (VWC %), foliar canopy temperature (°C), vapor pressure deficit (VPD in kPa), and bio-aerosol pathogen spore concentration (spores/m³).
- **Interactive Simulation Sandbox:** Test microclimate humidity surges, autonomous precision drone fungicide dispatch, and sub-surface drip fertigation with variable simulation speeds (1x, 2x, 5x).
- **Sector Telemetry Dossier & Event Audit Log:** Detailed biophysical diagnostics and manual intervention controls.

### 3. Dynamic Groq AI Pathogen Guidance Engine
- Automated query to Groq Cloud LLM API on every foliar scan.
- Generates dynamic, specimen-specific **Recommended Actions**, **Chemical Fungicide Treatments**, **Organic Biological Remedies**, and exact **Standard Dosages**.

### 4. Hands-Free Multilingual Voice Agronomist Copilot
- Supports 9 languages: **English, Hindi (हिन्दी), Spanish (Español), Punjabi (ਪੰਜਾਬੀ), Bengali (বাংলা), French (Français), Marathi (मराठी), Telugu (తెలుగు), and German (Deutsch)**.
- Hands-free speech recognition (Web Speech API) and natural audio speaker button on every response bubble.
- Clean conversational UI with model badges hidden.

### 5. Farm Plot GIS Outbreak Heatmap & Spore Radius
- Geospatial Leaflet map tracking localized disease clusters across farm plots.
- Live GPS field locator button to center the map on the user's active field coordinates.
- Visual spore contagion dispersion radii (400m–700m hazard zones) and plot pathology dossiers.

### 6. Multi-Day Crop Recovery Timeline & Healing Index
- 4-Stage recovery progression roadmap: Day 0 (Foliar Intervention), Day 3 (Mycelial Arrest), Day 7 (Tissue Desiccation), and Day 14 (Canopy Restoration).
- Live **Folia Healing Index (0–100%)** tracking recovery progress with localized milestone persistence.

### 7. Pre-Harvest Interval (PHI) & Chemical Safety Tracker
- Live countdown timers tracking chemical residue clearance before safe harvesting.
- Restricted-Entry Interval (REI) clock for worker field entry safety.
- Built-in database for Mancozeb, Chlorothalonil, Copper Hydroxide, Ridomil Gold, Azoxystrobin, and Dimethomorph.

### 8. Farm Economics & Yield Loss Estimator
- Interactive financial loss vs. saved crop revenue model in **USD ($)** and **INR (₹)**.
- Calculates unmitigated yield loss at risk, net revenue protected by AI treatment plans, and treatment ROI multiplier.

### 9. 1-Click WhatsApp & SMS Farm Worker Field Crew Dispatch
- Formats structured field directives containing target plot, diagnosis, active chemical ingredient, dosage rate, water volume, and required PPE safety equipment.
- Direct dispatch links for WhatsApp (`https://api.whatsapp.com/send`), SMS (`sms:?body=`), and clipboard copy.

### 10. Multi-Crop Pathology Selector
- Quick-switch diagnostic target modes for **Potato**, **Tomato**, **Corn / Maize**, **Grapevine**, and **Apple Orchard**.

### 11. Explainable AI (XAI) Lesion Loupe & Segmentation
- Interactive **2.5x Zoom Magnifier Loupe** for fine-grained leaf inspection.
- 4 Inspection views: Split-View slider, Thermal XAI spectrum, Heatmap overlay, and Spore hotspot boxes.

### 12. Knapsack Sprayer Simulator & PPE Safety Checklist
- Physics-based liquid fill animation, dilution mixer, nozzle geometry selector, and interactive PPE readiness score.

### 13. MongoDB Atlas Cloud Field Journal
- Persistent cloud storage for scan records in `agropath_db.scans` and multi-turn conversations in `agropath_db.chat_history`.
- CSV export and filterable history view.

### 14. Midnight Dark & Light Design System
- Sleek midnight sapphire palette (`#080c14`, `#0f1422`, `#38bdf8` electric blue accents) and clean light mode.
- Vector SVG icons with strictly zero emojis across the entire UI.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS Design System, Leaflet GIS, Web Speech API |
| **Backend** | Python 3.10+, Flask, Flask-CORS, Werkzeug |
| **AI / ML / LLM** | TensorFlow 2.x, Keras 3.x, OpenCV (cv2), NumPy, Groq Cloud AI API |
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

*Server runs on `http://localhost:5001`.*

---

### 4. Frontend Setup

```bash
cd Frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```

*Frontend runs on `http://localhost:3000` (or `http://localhost:5173`).*

---

## API Documentation

### Foliar Diagnostics
- `POST /predict` — Classify uploaded image file (multipart/form-data) with dynamic Groq AI recommendations.
- `POST /predict_base64` — Classify base64 image payload with dynamic Groq AI recommendations.
- `GET /classes` — List supported crop pathogen classes.

### Multilingual AI Agronomist Copilot
- `POST /chat` — Multi-turn conversation with Groq AI agronomist engine with language localization.
  ```json
  {
    "message": "फसल पर छिड़काव की सही मात्रा क्या है?",
    "history": [],
    "language": "hi",
    "context": { "disease": "Early Blight", "confidence": 96.2 }
  }
  ```

### Cloud Field Journal (MongoDB Atlas)
- `GET /api/history` — Fetch recent scans (supports `limit` and `filter` query params).
- `POST /api/history` — Archive field inspection record.
- `DELETE /api/history/clear` — Clear historical scan collection.
- `GET /api/stats` — Aggregate disease outbreak counters.

### System Diagnostics
- `GET /health` — Reports status of TensorFlow, Groq LLM, and MongoDB connections.
- `GET /info` — API metadata, active model versions, and engine specifications.

---

## License

This project is licensed under the MIT License.
