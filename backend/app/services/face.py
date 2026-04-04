import cv2
import mediapipe as mp
import numpy as np
import math
from typing import Tuple
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import urllib.request
import os

# Download the face landmarker model if not present
MODEL_PATH = "face_landmarker.task"
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

def download_model():
    if not os.path.exists(MODEL_PATH):
        print("Downloading face landmarker model...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Model downloaded.")

download_model()

LANDMARKS = {
    'chin':              152,
    'forehead':          10,
    'left_cheek':        234,
    'right_cheek':       454,
    'left_jaw':          172,
    'right_jaw':         397,
    'left_forehead':     70,
    'right_forehead':    300,
}

def get_coords(landmarks, index: int, w: int, h: int) -> Tuple[int, int]:
    lm = landmarks[index]
    return (int(lm.x * w), int(lm.y * h))

def distance(p1, p2) -> float:
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def classify_face_shape(face_width, jaw_width, face_length, forehead_width) -> str:
    width_to_length  = face_width / face_length
    jaw_to_face      = jaw_width / face_width
    forehead_to_face = forehead_width / face_width

    if width_to_length >= 0.85:
        return 'Square' if jaw_to_face >= 0.85 else 'Round'
    elif width_to_length < 0.65:
        return 'Oblong'
    else:
        if forehead_to_face > 0.85 and jaw_to_face < 0.75:
            return 'Heart'
        elif jaw_to_face < 0.75 and forehead_to_face < 0.85:
            return 'Diamond'
        else:
            return 'Oval'

def detect_face_shape(image_bytes: bytes) -> dict:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
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
            raise ValueError("No face detected. Please use a clear front-facing photo.")

        landmarks = result.face_landmarks[0]

        chin           = get_coords(landmarks, LANDMARKS['chin'],           w, h)
        forehead       = get_coords(landmarks, LANDMARKS['forehead'],       w, h)
        left_cheek     = get_coords(landmarks, LANDMARKS['left_cheek'],     w, h)
        right_cheek    = get_coords(landmarks, LANDMARKS['right_cheek'],    w, h)
        left_jaw       = get_coords(landmarks, LANDMARKS['left_jaw'],       w, h)
        right_jaw      = get_coords(landmarks, LANDMARKS['right_jaw'],      w, h)
        left_forehead  = get_coords(landmarks, LANDMARKS['left_forehead'],  w, h)
        right_forehead = get_coords(landmarks, LANDMARKS['right_forehead'], w, h)

        face_width     = distance(left_cheek,    right_cheek)
        face_length    = distance(forehead,      chin)
        jaw_width      = distance(left_jaw,      right_jaw)
        forehead_width = distance(left_forehead, right_forehead)

        face_shape = classify_face_shape(face_width, jaw_width, face_length, forehead_width)

        return {
            "face_shape": face_shape,
            "measurements": {
                "face_width":     round(face_width, 1),
                "face_length":    round(face_length, 1),
                "jaw_width":      round(jaw_width, 1),
                "forehead_width": round(forehead_width, 1),
            }
        }