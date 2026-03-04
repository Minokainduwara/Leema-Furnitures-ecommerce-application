Activate venv

source .venv/bin/activate



bun install

pip install fastapi uvicorn


Run Backend
uvicorn main:app --reload

python -m pip install firebase-admin