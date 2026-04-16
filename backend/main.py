from fastapi import FastAPI, UploadFile, File
from typing import List
from routes import fileRoutes
from config.database import Base, engine
from models.file import File as FileModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fileRoutes.router)
Base.metadata.create_all(bind=engine)

print(Base.metadata.tables)