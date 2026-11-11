from pathlib import Path
from ultralytics import YOLO
from waste_info import waste_info


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best.pt"

model = YOLO(str(MODEL_PATH))


def predict_waste(image_path):
    result = model.predict(
        source=image_path,
        verbose=False
    )[0]

    predicted_class = result.names[result.probs.top1]
    confidence = float(result.probs.top1conf)

    info = waste_info[predicted_class]

    return {
        "class": predicted_class,
        "confidence": confidence,
        "type": info["type"],
        "recyclable": info["recyclable"],
        "compostable": info["compostable"],
        "disposal": info["disposal"]
    }