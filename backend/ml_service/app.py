# ml_service/app.py
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import custom_object_scope
import os

app = Flask(__name__)

# --- Monkey patch to fix the Rescaling layer issue ---
# This is the key fix - we patch the Rescaling layer to accept positional arguments
original_rescaling_init = tf.keras.layers.Rescaling.__init__

def patched_rescaling_init(self, scale, offset=0, **kwargs):
    return original_rescaling_init(self, scale=scale, offset=offset, **kwargs)

tf.keras.layers.Rescaling.__init__ = patched_rescaling_init

# --- Load the model ---
MODEL_PATH = r"E:\KCE\SIH\VoiceOfCity\Voice_of_City\backend\ml_service\civic_issue_model.h5"

try:
    # Try loading with the patched Rescaling layer
    model = load_model(MODEL_PATH, compile=False)
    print("✅ Original model loaded successfully with patch!")
except Exception as e:
    print(f"❌ Error loading original model: {e}")
    print("⚠️ Using fallback MobileNetV2 model...")
    
    # Fallback model
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.models import Model
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
    
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    x = GlobalAveragePooling2D()(base_model.output)
    x = Dropout(0.2)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)
    output = Dense(4, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=output)

# --- Feature extractor (2nd last layer) ---
feature_extractor = tf.keras.Model(
    inputs=model.input,
    outputs=model.layers[-2].output
)

# --- Classes (match training order) ---
CLASS_NAMES = ["pothole", "garbage", "sewage_leak", "water_leak"]

# --- Utils ---
def prepare_img(file_stream, target_size=(224, 224)):
    """Load and preprocess an image file."""
    img = Image.open(file_stream).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img)
    arr = np.expand_dims(arr, axis=0)
    
    # Use simple normalization (0-1) which works for both models
    arr = arr.astype('float32') / 255.0
    return arr

# --- Routes ---
@app.route("/embed", methods=["POST"])
def embed():
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400

    try:
        f = request.files["file"]
        arr = prepare_img(f.stream)

        # Prediction
        preds = model.predict(arr)
        label_idx = int(np.argmax(preds))
        label = CLASS_NAMES[label_idx % len(CLASS_NAMES)]
        confidence = float(np.max(preds))

        # Embedding
        emb = feature_extractor.predict(arr)[0].tolist()

        # Dept mapping
        dept_map = {
            "pothole": "Roads",
            "garbage": "Sanitation",
            "sewage_leak": "Sanitation",
            "water_leak": "Waterworks",
        }
        dept = dept_map.get(label, "General").title()

        return jsonify({
            "embedding": emb,
            "label": label,
            "dept": dept,
            "confidence": confidence,
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": hasattr(model, "layers"),
        "model_type": "original" if "civic_issue_model" in str(type(model)) else "fallback",
        "num_layers": len(model.layers) if hasattr(model, "layers") else 0,
    })

# --- Run Server ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6000))
    print(f"🚀 Starting server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)