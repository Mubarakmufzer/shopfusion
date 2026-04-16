import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from auth import get_current_admin
from models.user import User

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = "uploads"

@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin)
):
    # Ensure upload directory exists
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    # Check file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.")

    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save the file
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # Return the URL path
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}
