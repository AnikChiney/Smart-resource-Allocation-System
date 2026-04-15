from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from config.database import SessionLocal
from typing import List
from sqlalchemy.orm import Session
from config.database import SessionLocal
from controllers.fileController import save_file, save_file_db, get_file_by_id, delete_file

router = APIRouter()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------
# Upload Single File
# -------------------------------
@router.post("/upload/")
def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename, filepath = save_file(file)
    db_file = save_file_db(db, filename, filepath)

    return {
        "id": db_file.id,
        "filename": db_file.filename,
        "filepath": db_file.filepath
    }


# -------------------------------
# Upload Multiple Files
# -------------------------------
@router.post("/upload-multiple/")
def upload_multiple_files(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    uploaded_files = []

    for file in files:
        filename, filepath = save_file(file)
        db_file = save_file_db(db, filename, filepath)

        uploaded_files.append({
            "id": db_file.id,
            "filename": db_file.filename,
            "filepath": db_file.filepath
        })

    return {"files": uploaded_files}


# -------------------------------
# Get File by ID
# -------------------------------
@router.get("/file/{file_id}")
def get_file(file_id: int, db: Session = Depends(get_db)):
    file = get_file_by_id(db, file_id)

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return {
        "id": file.id,
        "filename": file.filename,
        "filepath": file.filepath
    }


# -------------------------------
# Download File
# -------------------------------
@router.get("/download/{file_id}")
def download_file(file_id: int, db: Session = Depends(get_db)):
    file = get_file_by_id(db, file_id)

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(path=file.filepath, filename=file.filename)


# -------------------------------
# Delete File
# -------------------------------
@router.delete("/delete/{file_id}")
def delete_file_route(file_id: int, db: Session = Depends(get_db)):
    file = delete_file(db, file_id)

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return {"message": "File deleted successfully"}