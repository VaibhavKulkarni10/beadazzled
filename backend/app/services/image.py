import urllib.parse

def generate_jewelry_image(recommendation: str, face_shape: str, skin_tone: str, jewelry_type: str = "necklace") -> str:
    """
    Returns a Pollinations AI image URL.
    The frontend loads the image directly — no backend HTTP request needed.
    """
    prompt = build_image_prompt(recommendation, face_shape, skin_tone, jewelry_type)
    encoded = urllib.parse.quote(prompt)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed=42"


def build_image_prompt(recommendation: str, face_shape: str, skin_tone: str, jewelry_type: str) -> str:
    snippet = recommendation[:200]
    prompt = (
        f"Professional product photography of handmade beaded {jewelry_type}, "
        f"macro shot on white background, studio lighting, "
        f"designed for {face_shape} face shape and {skin_tone} skin tone, "
        f"{snippet}, "
        f"high quality, detailed, elegant"
    )
    return prompt[:400]