from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/transform", methods=["POST"])
def transform_image():
    try:
        data = request.json
        image_data = data.get("image")
        style = data.get("style")

        if not image_data or not style:
            return jsonify({"error": "Missing image or style"}), 400

        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(",")[-1])

        # Save original image for reference
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{style}.png"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        with open(filepath, "wb") as f:
            f.write(image_bytes)

        # Placeholder: In real use, send to AI model or Replicate API
        result_url = f"http://localhost:5000/static/{filename}"

        return jsonify({"result_url": result_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
