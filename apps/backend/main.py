from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models.user import User
from routes import cart, order

Base.metadata.create_all(bind=engine)

from routes import user, auth, admin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend running"}

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(cart.router)
app.include_router(order.router)