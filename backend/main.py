from fastapi import FastAPI,UploadFile,File
from typing import List
from routes import fileRoutes
from config.database import Base, engine
from models.file import File
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fileRoutes.router)