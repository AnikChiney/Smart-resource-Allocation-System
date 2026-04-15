import os
import uuid
from sqlalchemy.orm import Session
from models import file as models

UPLOAD_DIR = "uploads" #Folder "uploads" will be created in the root directory of the project to store uploaded files
os.makedirs(UPLOAD_DIR, exist_ok=True) #avoid error if the folder already exists


def save_file(file):
    unique_name = f"{uuid.uuid4()}_{file.filename}" #generate a unique name for the file
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file.filename, file_path


def save_file_db(db: Session, filename: str, filepath: str):
    db_file = models.File(filename=filename, filepath=filepath)
    db.add(db_file) #stage object
    db.commit() #persist to DB
    db.refresh(db_file) #reload updated object (e.g., auto-generated ID)
    return db_file


def get_file_by_id(db: Session, file_id: int):
    return db.query(models.File).filter(models.File.id == file_id).first()


def delete_file(db: Session, file_id: int):
    file = get_file_by_id(db, file_id)

    if not file:
        return None

    if os.path.exists(file.filepath):
        os.remove(file.filepath)

    db.delete(file)
    db.commit()

    return file