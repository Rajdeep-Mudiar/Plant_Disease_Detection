# Plant Disease Detection Backend API

Flask backend API for potato disease detection using TensorFlow/Keras model.

## Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the server:**

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /health
```

Returns server and model status.

**Response:**

```json
{
  "status": "healthy",
  "model_loaded": true,
  "tensorflow_version": "2.20.0",
  "keras_version": "3.12.0"
}
```

### Get API Info

```
GET /info
```

Returns available endpoints and API information.

### Get Disease Classes

```
GET /classes
```

Returns available disease classes.

**Response:**

```json
{
  "classes": ["Early Blight", "Late Blight", "Healthy"],
  "count": 3
}
```

### Predict (Multipart Form Data)

```
POST /predict
```

Upload image as multipart/form-data with field name `image`.

**Request:**

- Form data with key `image` and image file (jpg, jpeg, png, gif)

**Response:**

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

### Predict (Base64 Image)

```
POST /predict_base64
```

Send base64 encoded image as JSON.

**Request:**

```json
{
  "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

**Response:**
Same as `/predict` endpoint.

## Usage Examples

### Python (requests library)

```python
import requests
import cv2
import base64

# Load image
image = cv2.imread('potato_leaf.jpg')

# Method 1: Multipart Form Data
with open('potato_leaf.jpg', 'rb') as f:
    files = {'image': f}
    response = requests.post('http://localhost:5000/predict', files=files)
    print(response.json())

# Method 2: Base64
with open('potato_leaf.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()
    response = requests.post('http://localhost:5000/predict_base64',
                           json={'image': image_data})
    print(response.json())
```

### JavaScript (Fetch API)

```javascript
// Method 1: FormData (Multipart)
const formData = new FormData();
const imageInput = document.getElementById("imageInput");
formData.append("image", imageInput.files[0]);

fetch("http://localhost:5000/predict", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log(data));

// Method 2: Base64
const reader = new FileReader();
reader.onload = (e) => {
  const base64Image = e.target.result.split(",")[1];

  fetch("http://localhost:5000/predict_base64", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};
reader.readAsDataURL(imageInput.files[0]);
```

## React Integration Example

See the `frontend` folder for a complete React implementation.

### Basic React Hook

```jsx
const [prediction, setPrediction] = useState(null);

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setPrediction(data.prediction);
  } catch (error) {
    console.error("Error:", error);
  }
};

return (
  <div>
    <input type="file" onChange={handleImageUpload} accept="image/*" />
    {prediction && (
      <div>
        <h2>{prediction.disease}</h2>
        <p>Confidence: {prediction.confidence}%</p>
      </div>
    )}
  </div>
);
```

## Model Details

- **Input Size:** 256x256 pixels
- **Color Space:** RGB
- **Classes:** Early Blight, Late Blight, Healthy
- **Architecture:** Convolutional Neural Network with Resizing & Rescaling layers
- **Loss Function:** SparseCategoricalCrossentropy
- **Optimizer:** Adam

## Notes

- The model includes Resizing (256x256) and Rescaling (1/255) layers
- Images are automatically resized and rescaled by the model
- Supported formats: PNG, JPG, JPEG, GIF
- Maximum recommended image size: 10MB
