FROM python:3.10-slim

# התקנות מערכת
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# העתקת תלויות
COPY requirements.txt .

# התקנת ספריות עם גרסאות מדויקות
RUN pip install --no-cache-dir -r requirements.txt

# העתקת שאר הקבצים (קוד + last.pt)
COPY . .

# הרצת Flask
CMD ["python", "app.py"]
