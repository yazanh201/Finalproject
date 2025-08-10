from flask import Flask, request, jsonify
from flask_cors import CORS
from plate_detect import detect_plate_number
import os
import tempfile

app = Flask(__name__)
CORS(app)  # אפשר להשאיר כללי. אפשר לצמצם לאוריג׳ינים שלך אם תרצה.

@app.route("/api/plate-detect", methods=["POST"])
def detect_plate():
    print("📥 קיבלתי בקשת POST")
    if 'image' not in request.files:
        return jsonify({"error": "Missing image"}), 400

    file = request.files['image']

    # שמור זמנית לקובץ בטוח
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        file.save(tmp.name)
        plate = detect_plate_number(tmp.name)

    if plate:
        return jsonify({"plateNumber": plate})
    else:
        return jsonify({"error": "Plate not recognized"}), 404

# ✅ Health check עבור Render
@app.get("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3300))  # ✅ Render מזריק PORT
    app.run(host="0.0.0.0", port=port, debug=False)
