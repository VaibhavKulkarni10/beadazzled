import google.generativeai as genai
import os
import base64
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_jewelry_image(
    recommendation: str,
    face_shape: str,
    skin_tone: str,
    jewelry_type: str = "bracelet"
) -> str | None:
    """
    Generate an image of the jewelry piece using Gemini Imagen.
    Returns base64 encoded image string or None if failed.
    """
    try:
        prompt = build_image_prompt(recommendation, face_shape, skin_tone, jewelry_type)
        
        model = genai.ImageGenerationModel("imagen-3.0-generate-002")
        
        result = model.generate_images(
            prompt=prompt,
            number_of_images=1,
            aspect_ratio="1:1",
        )
        
        if result.images:
            image_bytes = result.images[0]._image_bytes
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            return f"data:image/png;base64,{base64_image}"
        
        return None
        
    except Exception as e:
        print(f"Image generation failed: {e}")
        return None


def build_image_prompt(recommendation: str, face_shape: str, skin_tone: str, jewelry_type: str) -> str:
    snippet = recommendation[:300] if recommendation else ""
    
    prompt = (
        f"Professional product photography of a handmade beaded {jewelry_type}, "
        f"macro shot on white background, studio lighting, "
        f"designed for {face_shape} face shape and {skin_tone} skin tone, "
        f"{snippet}, "
        f"high quality, detailed, elegant, jewelry store style"
    )
    
    return prompt[:500]