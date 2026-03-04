from dotenv import load_dotenv
import os
from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore


# Load your .env.local file first
load_dotenv(dotenv_path=".env.local")

from firebase_config import initialize_firebase  # import after loading env

app = FastAPI()

# Optional: check that the env variable is loaded correctly
print("FIREBASE_CREDENTIALS_PATH:", os.getenv("FIREBASE_CREDENTIALS_PATH"))

# Initialize Firebase
initialize_firebase()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, PUT, DELETE etc.
    allow_headers=["*"],  # allow all headers
)


@app.get("/")
def root():
    return {"status": "Firebase initialized"}