# ml_service/app.py
from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image as kimage
import os

app = Flask(__name__)
model = MobileNetV2(weights="imagenet", include_top=True)
feature_extractor = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")  # for embeddings

def prepare_img(file_stream, target_size=(224,224)):
    img = Image.open(file_stream).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img)
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)
    return arr

@app.route("/embed", methods=["POST"])
def embed():
    if "file" not in request.files:
        return jsonify({"error":"no file"}), 400
    f = request.files["file"]
    arr = prepare_img(f.stream)
    # classification
    preds = model.predict(arr)
    decoded = decode_predictions(preds, top=3)[0]
    label = decoded[0][1]
    confidence = float(decoded[0][2])

    # embedding
    emb = feature_extractor.predict(arr)[0]  # vector
    emb_list = emb.tolist()

    # basic mapping label -> dept (you should refine)
    dept_map = {
      "pothole": "Roads",
      "streetcar": "Transport",
      "garbage": "Sanitation",
      # default fallback
    }
    dept = None
    # try to map keywords
    for k in dept_map:
        if k in label.lower():
            dept = dept_map[k]
            break
    if not dept:
        # simple heuristics: if label contains 'streetlight' -> Electricity etc.
        if "streetlight" in label.lower() or "lamp" in label.lower() or "traffic" in label.lower():
            dept = "Electricity"
        else:
            dept = "General"

    return jsonify({"embedding": emb_list, "label": label, "dept": dept, "confidence": confidence})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6000))
    app.run(host="0.0.0.0", port=port)
