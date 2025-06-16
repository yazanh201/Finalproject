from flask import Flask, request, jsonify
from flask_cors import CORS
from plate_detect import detect_plate_number

app = Flask(__name__)
CORS(app)  # מתיר בקשות מבחוץ (כולל React)

@app.route("/api/plate-detect", methods=["POST"])
def detect_plate():
    print("📥 קיבלתי בקשת POST")
    if 'image' not in request.files:
        return jsonify({"error": "Missing image"}), 400

    file = request.files['image']
    file.save("temp.jpg")
    plate = detect_plate_number("temp.jpg")
    if plate:
        return jsonify({"plateNumber": plate})
    else:
        return jsonify({"error": "Plate not recognized"}), 404

if __name__ == "__main__":
   app.run(host="0.0.0.0", port=3300, debug=True)

