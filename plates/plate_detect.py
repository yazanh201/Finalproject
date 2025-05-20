import torch
import re
from torch.serialization import add_safe_globals
add_safe_globals(['ultralytics.nn.tasks.DetectionModel'])

from ultralytics import YOLO
import cv2
import numpy as np
import easyocr
import os

# --- הגדרות
MODEL_PATH = "./last.pt"
TEMP_IMAGE_PATH = "temp.jpg"

# --- בדיקת קיום מודל
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ הקובץ {MODEL_PATH} לא נמצא!")

print("🧠 טוען את המודל...")
model = YOLO(MODEL_PATH)
reader = easyocr.Reader(['en'])

# --- פונקציית זיהוי לוחית
def detect_plate_number(image_path):
    print("🚀 מזהה לוחית מתוך:", image_path)

    if not os.path.exists(image_path):
        print("❌ קובץ התמונה לא נמצא")
        return None

    try:
        results = model(image_path)
    except Exception as e:
        print(f"❌ שגיאה בהרצת המודל: {e}")
        return None

    if not results:
        print("⚠️ לא נמצאו תוצאות כלל")
        return None

    for result in results:
        if not result.boxes or len(result.boxes) == 0:
            print("⚠️ לא נמצאו תיבות (boxes)")
            continue

        for i, box in enumerate(result.boxes):
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            print(f"📦 תיבה {i}: ({x1},{y1}) - ({x2},{y2})")

            plate_crop = result.orig_img[y1:y2, x1:x2]

            # עיבוד תמונה לאופטימיזציית OCR
            gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)
            gray = cv2.bilateralFilter(gray, 11, 17, 17)

            # זיהוי טקסט
            ocr_result = reader.readtext(gray, detail=0, paragraph=False)
            print(f"🔍 תוצאה מ־OCR: {ocr_result}")

            # ניקוי – השארת רק ספרות
            raw_text = ''.join(ocr_result).replace(" ", "")
            plate_text = re.sub(r'\D', '', raw_text)  # השאר רק מספרים

            if plate_text and 7 <= len(plate_text) <= 8:
                print(f"✅ מספר שזוהה: {plate_text}")
                return plate_text
            else:
                print(f"⚠️ התוצאה לא עומדת בקריטריון אורך: {plate_text}")

    print("❌ לא זוהתה לוחית סופית")
    return None
