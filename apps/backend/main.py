from dotenv import load_dotenv
import os
from fastapi import FastAPI  # type: ignore

# Load your .env.local file first
load_dotenv(dotenv_path=".env.local")

from firebase_config import initialize_firebase  # import after loading env

app = FastAPI()

# Optional: check that the env variable is loaded correctly
print("FIREBASE_CREDENTIALS_PATH:", os.getenv("FIREBASE_CREDENTIALS_PATH"))

# Initialize Firebase
initialize_firebase()

@app.get("/")
def root():
    return {"status": "Firebase initialized"}