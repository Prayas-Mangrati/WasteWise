from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from predictor import predict_waste
# from database import create_table
from database import create_table, get_connection
CONFIDENCE_THRESHOLD = 0.70

import tempfile
import os
from pathlib import Path


app = FastAPI(title="WasteWise API")
create_table()


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://waste-wise-bay-gamma.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "WasteWise API is running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Get the uploaded file extension
    file_extension = Path(file.filename).suffix

    # Save uploaded image temporarily
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=file_extension
    ) as temp_file:

        contents = await file.read()
        temp_file.write(contents)
        temp_path = temp_file.name

    try:
        # Send image to our existing YOLO prediction function
        result = predict_waste(temp_path)

        if result["confidence"] < CONFIDENCE_THRESHOLD:
            return {
                "success": False,
                "uncertain": True,
                "confidence": result["confidence"],
                "message": "The image could not be identified with enough confidence.",
                "suggestion": "Please try again with a clearer image and make sure the waste item is clearly visible."
            }

        connection = get_connection()

        connection.execute(
            """
            INSERT INTO scans (
                waste_class,
                confidence,
                waste_type,
                recyclable,
                compostable,
                disposal
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                result["class"],
                result["confidence"],
                result["type"],
                result["recyclable"],
                result["compostable"],
                result["disposal"],
            )
        )

        connection.commit()
        connection.close()

        return {
            "success": True,
            **result
        }

    finally:
        # Delete temporary image after prediction
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.get("/history")
def get_history():
    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            id,
            waste_class,
            confidence,
            waste_type,
            recyclable,
            compostable,
            disposal,
            created_at
        FROM scans
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]  