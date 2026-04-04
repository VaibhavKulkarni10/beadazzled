from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import Optional
from app.services.face import detect_face_shape
from app.services.skin import detect_skin_tone
from app.services.claude import get_design_recommendation, get_tryon_feedback
from app.services.image import generate_jewelry_image

router = APIRouter()

@router.post("/analyse")
async def analyse(
    file: UploadFile = File(...),
    gender: str = Form("women"),
    jewelry_type: str = Form("necklace"),
):
    try:
        image_bytes = await file.read()

        face_data = detect_face_shape(image_bytes)
        skin_data = detect_skin_tone(image_bytes)

        recommendation = get_design_recommendation(
            image_bytes=image_bytes,
            face_shape=face_data["face_shape"],
            skin_tone=skin_data["skin_tone"],
            undertone=skin_data["undertone"],
            undertone_description=skin_data["undertone_description"],
            avg_rgb=skin_data["avg_rgb"],
            gender=gender,
            jewelry_type=jewelry_type,
        )

        # Just build the URL — frontend loads the image directly
        image_url = generate_jewelry_image(
            recommendation=recommendation["recommendation"],
            face_shape=face_data["face_shape"],
            skin_tone=skin_data["skin_tone"],
            jewelry_type=jewelry_type,
        )

        return {
            "success":        True,
            "face":           face_data,
            "skin":           skin_data,
            "recommendation": recommendation["recommendation"],
            "image_url":      image_url,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/tryon")
async def tryon(
    file: UploadFile = File(...),
    face_shape: str = Form(...),
    skin_tone: str = Form(...),
    undertone: str = Form(...),
    original_recommendation: Optional[str] = Form(None),
):
    try:
        image_bytes = await file.read()

        feedback = get_tryon_feedback(
            image_bytes=image_bytes,
            face_shape=face_shape,
            skin_tone=skin_tone,
            undertone=undertone,
            original_recommendation=original_recommendation,
        )

        image_url = generate_jewelry_image(
            recommendation=feedback["feedback"],
            face_shape=face_shape,
            skin_tone=skin_tone,
        )

        return {
            "success":   True,
            "feedback":  feedback["feedback"],
            "image_url": image_url,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Try-on analysis failed: {str(e)}")


@router.get("/health")
async def health():
    return {"status": "ok"}