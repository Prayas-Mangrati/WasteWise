from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from predictor import predict_waste

import tempfile
import os
from pathlib import Path


app = FastAPI(title="WasteWise API")


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

        return result

    finally:
        # Delete temporary image after prediction
        if os.path.exists(temp_path):
            os.remove(temp_path)