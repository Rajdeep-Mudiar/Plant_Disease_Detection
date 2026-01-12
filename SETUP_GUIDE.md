# Plant Disease Detection - Full Stack Setup Guide

Complete guide to set up and run the plant disease detection application with Flask backend and React frontend.

## 📁 Project Structure

```
Plant Disease Flask App/
└── Plant_Disease/
    ├── backend/                          # Flask API backend
    │   ├── app.py                        # Main Flask application
    │   ├── requirements.txt               # Python dependencies
    │   └── README.md                      # Backend documentation
    ├── frontend/                         # React frontend
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── PredictorCard.jsx     # Main component
    │   │   │   └── PredictorCard.css     # Component styles
    │   │   ├── App.jsx
    │   │   ├── App.css
    │   │   └── index.js
    │   ├── package.json
    │   ├── .env                          # Environment variables
    │   └── README.md                     # Frontend documentation
    ├── potato_disease_detection_model.keras
    ├── potato_disease_detection_model.json
    ├── potato_disease_detection_model_weights.weights.h5
    └── main_app.py                       # Original Streamlit app (optional)
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend folder:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Run Flask server:**

```bash
python app.py
```

Expected output:

```
==================================================
Plant Disease Detection API Server
==================================================
✓ Model loaded from ./potato_disease_detection_model.keras

✓ Starting Flask server...
Available endpoints:
  - GET  /health
  - GET  /info
  - GET  /classes
  - POST /predict (multipart/form-data)
  - POST /predict_base64 (base64 image in JSON)

Server running on http://localhost:5000
==================================================
```

### Frontend Setup

1. **Navigate to frontend folder:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**
   Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000
```

4. **Start development server:**

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

The backend automatically:

- Loads the trained model from `../potato_disease_detection_model.keras`
- Falls back to JSON + Weights if `.keras` file not found
- Enables CORS for React frontend
- Runs on `http://localhost:5000`

**To change the port:**
Edit `app.py` line ~285:

```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Change 5000 to your port
```

### Frontend Configuration

**To change API URL:**
Edit `.env`:

```
REACT_APP_API_URL=http://your-backend-url:5000
```

## 📡 API Endpoints

### Health Check

```bash
curl http://localhost:5000/health
```

### Get Classes

```bash
curl http://localhost:5000/classes
```

### Predict (Upload Image)

```bash
curl -X POST -F "image=@potato_leaf.jpg" http://localhost:5000/predict
```

### Get API Info

```bash
curl http://localhost:5000/info
```

## 🧪 Testing

### Test Backend with Python

```python
import requests

# Upload image and get prediction
with open('potato_leaf.jpg', 'rb') as f:
    files = {'image': f}
    response = requests.post('http://localhost:5000/predict', files=files)
    result = response.json()

    print(f"Disease: {result['prediction']['disease']}")
    print(f"Confidence: {result['prediction']['confidence']}%")
    print(f"Tips: {result['guidance']['tips']}")
```

### Test with JavaScript (Browser Console)

```javascript
const formData = new FormData();
const fileInput = document.getElementById("imageInput");
formData.append("image", fileInput.files[0]);

fetch("http://localhost:5000/predict", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 📊 Model Information

- **Input:** 256x256 RGB images
- **Classes:** Early Blight, Late Blight, Healthy
- **Architecture:** CNN with Resizing & Rescaling layers
- **Loss:** SparseCategoricalCrossentropy
- **Optimizer:** Adam

## 🐛 Troubleshooting

### CORS Errors

**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** Flask CORS is already enabled. If still getting errors:

- Ensure backend is running on correct URL
- Check browser console for actual error message
- Try hard refresh (Ctrl+Shift+R)

### Model Not Found

**Problem:** "No model files found"

**Solution:** Ensure these files exist in the Plant_Disease folder:

- `potato_disease_detection_model.keras` OR
- `potato_disease_detection_model.json` + `potato_disease_detection_model_weights.weights.h5`

### API Connection Failed

**Problem:** "Error: Failed to fetch"

**Solution:**

1. Check backend is running: `curl http://localhost:5000/health`
2. Check firewall allows port 5000
3. Verify `REACT_APP_API_URL` in `.env`
4. Restart both servers

### Image Upload Not Working

**Problem:** "Could not decode image"

**Solution:**

- Use PNG, JPG, JPEG, or GIF format
- Image size should be under 10MB
- Try a different image

## 📦 Deployment

### Deploy Backend (Heroku)

1. Create `Procfile`:

```
web: gunicorn app:app
```

2. Install gunicorn:

```bash
pip install gunicorn
pip freeze > requirements.txt
```

3. Deploy:

```bash
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variable:
   - `REACT_APP_API_URL` = Your backend URL
3. Deploy automatically on push

## 📝 API Response Examples

### Success Response

```json
{
  "success": true,
  "prediction": {
    "disease": "Healthy",
    "confidence": 98.5,
    "all_predictions": {
      "Early Blight": 0.0123,
      "Late Blight": 0.0052,
      "Healthy": 0.9825
    }
  },
  "guidance": {
    "status": "🟢 Healthy Potato Crop",
    "tips": [
      "Maintain irrigation.",
      "Apply balanced fertilizers.",
      "Monitor for signs of disease."
    ]
  },
  "image_info": {
    "height": 480,
    "width": 640,
    "channels": 3
  }
}
```

### Error Response

```json
{
  "error": "No image provided",
  "success": false
}
```

## 🔐 Security Notes

- Model file is loaded once on startup (efficient)
- CORS allows requests from frontend
- File uploads limited to image formats
- No authentication required (add if deploying publicly)

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [TensorFlow/Keras Guide](https://www.tensorflow.org/guide)
- [OpenCV Python Docs](https://docs.opencv.org/master/d6/d00/tutorial_py_root.html)

## ✅ Checklist

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Model files present in Plant_Disease folder
- [ ] Backend running on port 5000
- [ ] Frontend `.env` configured
- [ ] Frontend running on port 3000
- [ ] CORS working (no console errors)
- [ ] Test image upload works
- [ ] Predictions displayed correctly

## 💡 Tips

1. **Development:** Keep both servers running in separate terminals
2. **Debugging:** Check browser console (F12) and backend terminal for errors
3. **Performance:** Model loads once - first prediction may take ~2-3 seconds
4. **Testing:** Use different potato leaf images (Early Blight, Late Blight, Healthy)

## 📧 Support

For issues:

1. Check the troubleshooting section
2. Review backend/frontend README.md files
3. Check browser console and backend logs
4. Verify all files are in correct locations
