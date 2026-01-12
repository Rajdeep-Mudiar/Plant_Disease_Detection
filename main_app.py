# -----------------------------
# Library imports
# -----------------------------
import numpy as np
import streamlit as st
import cv2
import tensorflow as tf
from tensorflow.keras.models import model_from_json
import os

# 1. MUST BE THE VERY FIRST COMMAND: Page Configuration
st.set_page_config(page_title="Plant Disease Detector", page_icon="🌱")

# -----------------------------
# Load the model (JSON + Weights)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# EXACT FILENAMES FROM YOUR DIRECTORY (Matches image_c954aa.png)
JSON_PATH = os.path.join(BASE_DIR, "potato_disease_detection_model.json")
WEIGHTS_PATH = os.path.join(BASE_DIR, "potato_disease_detection_model_weights.weights.h5")
KERAS_PATH = os.path.join(BASE_DIR, "potato_disease_detection_model.keras")

# Cache model once per session
@st.cache_resource(show_spinner=False)
def load_plant_model():
    try:
        if os.path.exists(KERAS_PATH):
            # compile=False to skip optimizer state compatibility noise
            model = tf.keras.models.load_model(KERAS_PATH, compile=False)
            # Compile for predictions
            model.compile(loss='sparse_categorical_crossentropy', metrics=['accuracy'])
            return model

        # Check if JSON architecture file exists
        if not os.path.exists(JSON_PATH):
            st.error(f"Missing JSON file at: {JSON_PATH}")
            return None
            
        with open(JSON_PATH, 'r') as json_file:
            model_json = json_file.read()
        
        # Reconstruct model from JSON
        model = model_from_json(model_json)
        
        # Check if Weight file exists
        if not os.path.exists(WEIGHTS_PATH):
            st.error(f"Missing Weights file at: {WEIGHTS_PATH}")
            return None
            
        # Load weights into the architecture
        model.load_weights(WEIGHTS_PATH)
        # Compile for predictions
        model.compile(loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        return model
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None

# Initialize model loading
model = load_plant_model()

# Debug info to confirm runtime versions
st.caption(f"Runtime: TensorFlow {tf.__version__} | Keras {tf.keras.__version__}")

# -----------------------------
# Class names & Guidance
# From training notebook: image_dataset_from_directory loads classes in ALPHABETICAL order
# Classes are ordered alphabetically: ['Potato___Early_blight', 'Potato___healthy', 'Potato___Late_blight']
# So indices are: 0=Early Blight, 1=Healthy, 2=Late Blight
CLASS_NAMES = ["Early Blight", "Late Blight","Healthy"]

GUIDANCE = {
    "Healthy": {"status": "🟢 Healthy Potato Crop", "tips": ["Maintain irrigation.", "Apply balanced fertilizers.", "Monitor for signs of disease."]},
    "Early Blight": {"status": "🟠 Early Blight Detected", "tips": ["Remove infected leaves immediately.", "Apply fungicides (Chlorothalonil).", "Improve air circulation."]},
    "Late Blight": {"status": "🔴 Late Blight Detected (URGENT)", "tips": ["Destroy infected plants.", "Spray Metalaxyl or Mancozeb immediately.", "Isolate infected area."]}
}

# -----------------------------
# Streamlit UI
# -----------------------------
st.title("🌱 Plant Disease Detection & Crop Guidance")
st.markdown("Upload an image of a **potato leaf** to detect disease.")

plant_image = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
submit = st.button("Predict")

if submit:
    if plant_image is not None and model is not None:
        # Read and display image
        file_bytes = np.asarray(bytearray(plant_image.read()), dtype=np.uint8)
        opencv_image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        st.image(opencv_image, channels="BGR", caption="Uploaded Leaf Image", width=400)

        with st.spinner('Analyzing...'):
            # IMPORTANT: The model has Resizing & Rescaling layers built-in!
            # We should feed the raw image (0-255) directly
            processed_image = cv2.resize(opencv_image, (256, 256))
            # Convert BGR to RGB (training used RGB via image_dataset_from_directory)
            processed_image = cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB)
            # Feed as uint8 (0-255) - the model will rescale internally
            processed_image = np.expand_dims(processed_image, axis=0)

            # Debug: Show image stats
            st.write(f"Image shape: {processed_image.shape}")
            st.write(f"Image dtype: {processed_image.dtype}, min: {processed_image.min()}, max: {processed_image.max()}")

            # Perform Prediction
            predictions = model.predict(processed_image, verbose=0)
            predicted_index = np.argmax(predictions)
            disease_name = CLASS_NAMES[predicted_index]
            confidence = np.max(predictions) * 100
            
            # Debug: Show all class predictions
            st.write("**Debug - All Predictions (sorted by class):**")
            for i, class_name in enumerate(CLASS_NAMES):
                st.write(f"{i}. {class_name}: {predictions[0][i]:.6f}")

        # Display Results
        res = GUIDANCE[disease_name]
        st.success(f"**Prediction:** {res['status']} ({confidence:.2f}%)")
        st.subheader("🌾 Recommendations:")
        for tip in res["tips"]:
            st.markdown(f"- {tip}")
    elif model is None:
        st.error("Model loading failed. Please check the file path errors displayed above.")
    else:
        st.warning("Please upload an image first.")