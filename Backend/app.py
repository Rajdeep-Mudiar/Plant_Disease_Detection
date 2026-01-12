"""
Flask backend API for Plant Disease Detection
Serves predictions for React frontend
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import tensorflow as tf
import keras
from tensorflow.keras.models import model_from_json  # Use legacy TF-Keras for JSON models
import os
from werkzeug.utils import secure_filename
import io
import base64

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.dirname(BASE_DIR)  # Parent directory where models are stored
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Model paths
JSON_PATH = os.path.join(MODEL_DIR, "potato_disease_detection_model.json")
WEIGHTS_PATH = os.path.join(MODEL_DIR, "potato_disease_detection_model_weights.weights.h5")
KERAS_PATH = os.path.join(MODEL_DIR, "potato_disease_detection_model.keras")

# Class names and guidance
# IMPORTANT: Class order must be alphabetical to match training via
# image_dataset_from_directory (which sorts class subfolders alphabetically).
# Correct order: Early Blight, Healthy, Late Blight
CLASS_NAMES = ["Early Blight",  "Late Blight","Healthy"]
GUIDANCE = {
    "Healthy": {
        "status": "🟢 Healthy Potato Crop",
        "tips": ["Maintain irrigation.", "Apply balanced fertilizers.", "Monitor for signs of disease."]
    },
    "Early Blight": {
        "status": "🟠 Early Blight Detected",
        "tips": ["Remove infected leaves immediately.", "Apply fungicides (Chlorothalonil).", "Improve air circulation."]
    },
    "Late Blight": {
        "status": "🔴 Late Blight Detected (URGENT)",
        "tips": ["Destroy infected plants.", "Spray Metalaxyl or Mancozeb immediately.", "Isolate infected area."]
    }
}

# Global model variable
model = None

def load_plant_model():
    """Load the trained plant disease detection model"""
    global model
    try:
        if os.path.exists(KERAS_PATH):
            # Load new-format .keras model with Keras v3 loader
            model = keras.models.load_model(KERAS_PATH, compile=False)
            # Compile is optional for inference; keep for consistency
            model.compile(loss='sparse_categorical_crossentropy', metrics=['accuracy'])
            print(f"✓ Model loaded from {KERAS_PATH} using keras.models.load_model")
            return model
        
        if os.path.exists(JSON_PATH):
            # Load legacy JSON + weights using TF-Keras deserialization to ensure
            # compatibility with older serialization (e.g., batch_shape in InputLayer)
            with open(JSON_PATH, 'r') as json_file:
                model_json = json_file.read()
            model = model_from_json(model_json)

            if not os.path.exists(WEIGHTS_PATH):
                raise FileNotFoundError(f"Weights file not found: {WEIGHTS_PATH}")

            model.load_weights(WEIGHTS_PATH)
            model.compile(loss='sparse_categorical_crossentropy', metrics=['accuracy'])
            print(f"✓ Model loaded from JSON + Weights using tensorflow.keras.model_from_json")
            return model
        
        raise FileNotFoundError(f"No model files found at {MODEL_DIR}")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_array):
    """
    Preprocess image for model prediction
    Model has Resizing & Rescaling layers built-in, so feed raw uint8 (0-255)
    """
    try:
        # Resize to model input size
        processed = cv2.resize(image_array, (256, 256))
        
        # Convert BGR to RGB
        processed = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)
        
        # Add batch dimension (model expects batches)
        processed = np.expand_dims(processed, axis=0)
        
        return processed
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'tensorflow_version': tf.__version__,
        'keras_version': getattr(keras, '__version__', 'unknown')
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease from uploaded image
    Expects multipart/form-data with 'image' field
    Returns JSON with prediction, confidence, and guidance
    """
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Check filename
        if image_file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        if not allowed_file(image_file.filename):
            return jsonify({'error': f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Read image file
        image_bytes = image_file.read()
        image_array = np.frombuffer(image_bytes, np.uint8)
        opencv_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        if opencv_image is None:
            return jsonify({'error': 'Could not decode image'}), 400
        
        # Preprocess image
        processed_image = preprocess_image(opencv_image)
        if processed_image is None:
            return jsonify({'error': 'Image preprocessing failed'}), 500
        
        # Get prediction
        predictions = model.predict(processed_image, verbose=0)
        predicted_index = np.argmax(predictions[0])
        disease_name = CLASS_NAMES[predicted_index]
        confidence = float(np.max(predictions[0]) * 100)
        
        # Get guidance
        guidance = GUIDANCE.get(disease_name, {})
        
        # Prepare response
        response = {
            'success': True,
            'prediction': {
                'disease': disease_name,
                'confidence': round(confidence, 2),
                'all_predictions': {
                    CLASS_NAMES[i]: float(predictions[0][i])
                    for i in range(len(CLASS_NAMES))
                }
            },
            'guidance': guidance,
            'image_info': {
                'height': opencv_image.shape[0],
                'width': opencv_image.shape[1],
                'channels': opencv_image.shape[2]
            }
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/predict_base64', methods=['POST'])
def predict_base64():
    """
    Predict disease from base64 encoded image
    Expects JSON with 'image' field containing base64 data
    Returns JSON with prediction, confidence, and guidance
    """
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get JSON data
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        try:
            image_data = base64.b64decode(data['image'])
            image_array = np.frombuffer(image_data, np.uint8)
            opencv_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if opencv_image is None:
                return jsonify({'error': 'Could not decode image'}), 400
        except Exception as e:
            return jsonify({'error': f'Invalid base64 image: {str(e)}'}), 400
        
        # Preprocess image
        processed_image = preprocess_image(opencv_image)
        if processed_image is None:
            return jsonify({'error': 'Image preprocessing failed'}), 500
        
        # Get prediction
        predictions = model.predict(processed_image, verbose=0)
        predicted_index = np.argmax(predictions[0])
        disease_name = CLASS_NAMES[predicted_index]
        confidence = float(np.max(predictions[0]) * 100)
        
        # Get guidance
        guidance = GUIDANCE.get(disease_name, {})
        
        # Prepare response
        response = {
            'success': True,
            'prediction': {
                'disease': disease_name,
                'confidence': round(confidence, 2),
                'all_predictions': {
                    CLASS_NAMES[i]: float(predictions[0][i])
                    for i in range(len(CLASS_NAMES))
                }
            },
            'guidance': guidance,
            'image_info': {
                'height': opencv_image.shape[0],
                'width': opencv_image.shape[1],
                'channels': opencv_image.shape[2]
            }
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error in predict_base64 endpoint: {e}")
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get available disease classes"""
    return jsonify({
        'classes': CLASS_NAMES,
        'count': len(CLASS_NAMES)
    })

@app.route('/info', methods=['GET'])
def get_info():
    """Get API info"""
    return jsonify({
        'name': 'Plant Disease Detection API',
        'version': '1.0.0',
        'description': 'API for detecting potato plant diseases',
        'model_loaded': model is not None,
        'classes': CLASS_NAMES,
        'endpoints': {
            'health': 'GET /health',
            'info': 'GET /info',
            'classes': 'GET /classes',
            'predict_multipart': 'POST /predict (multipart/form-data)',
            'predict_base64': 'POST /predict_base64 (application/json)'
        }
    })

if __name__ == '__main__':
    print("=" * 50)
    print("Plant Disease Detection API Server")
    print("=" * 50)
    
    # Load model on startup
    model = load_plant_model()
    
    if model:
        print("\n✓ Starting Flask server...")
        print("Available endpoints:")
        print("  - GET  /health")
        print("  - GET  /info")
        print("  - GET  /classes")
        print("  - POST /predict (multipart/form-data)")
        print("  - POST /predict_base64 (base64 image in JSON)")
        print("\nServer running on http://localhost:5000")
        print("=" * 50 + "\n")
        
        # Run Flask app
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("\n✗ Failed to load model. Exiting...")
        exit(1)
