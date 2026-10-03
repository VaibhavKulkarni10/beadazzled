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
    try:
        prompt = build_image_prompt(recommendation, face_shape, skin_tone, jewelry_type)

        model = genai.GenerativeModel("gemini-2.0-flash-exp-image-generation")

        response = model.generate_content(
            contents=prompt,
            generation_config={"response_modalities": ["Text", "Image"]}
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data is not None:
                image_bytes = part.inline_data.data
                base64_image = base64.b64encode(image_bytes).decode('utf-8')
                mime_type = part.inline_data.mime_type or "image/png"
                return f"data:{mime_type};base64,{base64_image}"

        return None

    except Exception as e:
        print(f"Image generation failed: {e}")
        return None


def build_image_prompt(recommendation: str, face_shape: str, skin_tone: str, jewelry_type: str) -> str:
    snippet = recommendation[:300] if recommendation else ""
    prompt = (
        f"Professional product photography of a complete handmade beaded {jewelry_type} "
        f"laid flat on a clean white background, studio lighting, macro shot showing all beads clearly, "
        f"designed for {face_shape} face shape and {skin_tone} skin tone, "
        f"{snippet}, "
        f"high quality, detailed, elegant jewelry store style photo, "
        f"show the entire {jewelry_type} piece in full"
    )
    return prompt[:500]