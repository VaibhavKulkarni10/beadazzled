import anthropic
import base64
import os
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def encode_image(image_bytes: bytes) -> str:
    return base64.standard_b64encode(image_bytes).decode("utf-8")

def get_design_recommendation(
    image_bytes: bytes,
    face_shape: str,
    skin_tone: str,
    undertone: str,
    undertone_description: str,
    avg_rgb: list,
    gender: str = "women",
    jewelry_type: str = "necklace",
) -> dict:

    image_data = encode_image(image_bytes)

    prompt = f"""You are an expert jewelry designer specialising in handmade beaded jewelry.

I have analysed this person's features using computer vision:
- Gender: {gender}
- Face shape: {face_shape}
- Skin tone: {skin_tone}
- Undertone: {undertone} ({undertone_description})
- Jewelry type requested: {jewelry_type}

Look at their photo and provide a jewelry recommendation in EXACTLY this structure:

**DESIGN NAME**
One catchy name for the design (e.g. "The Golden Hour Bracelet")

**DESIGN DESCRIPTION**
2-3 sentences only. What it looks like, why it suits them. No more.

**BEAD COLOURS**
List exactly 4-5 colours. Each on its own line in this format:
Name — #HEXCODE — one sentence why it suits them

**BEAD PATTERN**
List the exact sequence of beads for one repeat. Each bead on its own line:
- Bead name (size) — #HEXCODE
End with: Repeat X times for full {jewelry_type}

**MATERIALS**
Bullet list only. Max 6 items. Just the names, no explanation.

**TUTORIAL**
Numbered steps only. Max 8 steps. One sentence per step. Beginner friendly.

**WHY THIS WORKS**
3 sentences maximum explaining why this suits their face shape and skin tone.

Be concise. No waffle. Every word should earn its place."""

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ],
            }
        ],
    )

    return {
        "mode": "design",
        "recommendation": message.content[0].text
    }


def get_tryon_feedback(
    image_bytes: bytes,
    face_shape: str,
    skin_tone: str,
    undertone: str,
    original_recommendation: Optional[str] = None,
) -> dict:
    """
    Mode 2 — How Does This Look?
    User is wearing the jewelry. Claude evaluates the look and suggests next designs.
    """

    image_data = encode_image(image_bytes)

    context = ""
    if original_recommendation:
        context = f"""
The person was previously recommended this design:
{original_recommendation}

Evaluate whether the jewelry they are wearing matches this recommendation and how well it works.
"""

    prompt = f"""You are an expert jewelry stylist evaluating how well someone's jewelry suits them.

Their features:
- Face shape: {face_shape}
- Skin tone: {skin_tone}
- Undertone: {undertone}
{context}

Look at this photo carefully. The person is wearing jewelry. Please provide:

1. **Overall Rating** — rate how well the jewelry suits them out of 10, with a one line verdict.

2. **What Works** — specific things about the jewelry that flatter their features.

3. **What Could Be Better** — honest, constructive feedback on what isn't working and why.

4. **Next Design Suggestion** — based on what you see, recommend a specific next piece they should make. Include bead colours, style and why it would work even better.

5. **Styling Tips** — how they could wear this piece better (with what outfits, hairstyles etc.)

Be honest but encouraging. This feedback should help them grow as a jewelry maker."""

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ],
            }
        ],
    )

    return {
        "mode": "tryon",
        "feedback": message.content[0].text
    }