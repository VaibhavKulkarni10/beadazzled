import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import os

MODEL_PATH = "face_landmarker.task"

SKIN_TONES = {
    'Fair':   (75, 100),
    'Light':  (60, 75),
    'Medium': (50, 60),
    'Olive':  (40, 50),
    'Brown':  (30, 40),
    'Deep':   (0,  30),
}

UNDERTONES = {
    'Warm':    'Golden, peachy or yellow undertones — gold metals suit you best',
    'Cool':    'Pink, red or bluish undertones — silver metals suit you best',
    'Neutral': 'A mix of warm and cool — both gold and silver work for you',
}

def classify_skin_tone(L: float) -> str:
    for tone, (low, high) in SKIN_TONES.items():
        if low <= L <= high:
            return tone
    return 'Medium'

def classify_undertone(a: float, b: float) -> str:
    if b > 15 and a > 5:
        return 'Warm'
    elif a > 10 and b < 10:
        return 'Cool'
    else:
        return 'Neutral'

def detect_skin_tone(image_bytes: bytes) -> dict:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    h, w = img.shape[:2]

    base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
    options = vision.FaceLandmarkerOptions(
        base_options=base_options,
        num_faces=1,
    )

    with vision.FaceLandmarker.create_from_options(options) as landmarker:
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=img_rgb
        )
        result = landmarker.detect(mp_image)

        if not result.face_landmarks:
            raise ValueError("No face detected for skin tone analysis.")

        landmarks = result.face_landmarks[0]

        # Sample from 5 regions: cheeks, forehead, nose bridge, chin
        sample_indices = [234, 454, 10, 6, 152]
        sample_radius = 15
        lab_samples = []
        rgb_samples = []

        for idx in sample_indices:
            lm = landmarks[idx]
            cx, cy = int(lm.x * w), int(lm.y * h)
            x1, x2 = max(0, cx - sample_radius), min(w, cx + sample_radius)
            y1, y2 = max(0, cy - sample_radius), min(h, cy + sample_radius)

            lab_region = img_lab[y1:y2, x1:x2]
            rgb_region = img_rgb[y1:y2, x1:x2]

            if lab_region.size > 0:
                lab_samples.append(np.mean(lab_region, axis=(0, 1)))
                rgb_samples.append(np.mean(rgb_region, axis=(0, 1)))

        avg_lab = np.mean(lab_samples, axis=0)
        avg_rgb = np.mean(rgb_samples, axis=0).astype(int).tolist()

        # Convert OpenCV LAB to standard ranges
        L = avg_lab[0] / 255 * 100
        a = avg_lab[1] - 128
        b = avg_lab[2] - 128

        skin_tone = classify_skin_tone(L)
        undertone = classify_undertone(a, b)

        return {
            "skin_tone":             skin_tone,
            "undertone":             undertone,
            "undertone_description": UNDERTONES[undertone],
            "avg_rgb":               avg_rgb,
            "lab_values":            {"L": round(L, 1), "a": round(a, 1), "b": round(b, 1)}
        }