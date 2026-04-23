from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User   
from schemas.user import UserRegister, UserLogin, ForgotPasswordRequest, ResetPasswordRequest 
from services.auth_service import create_user
from services.auth_service import forgot_password, reset_password
from auth import create_access_token  
from utils.security import verify_password


router = APIRouter()

import traceback

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    try:

        user = db.query(User).filter(User.email == data.email).first()

        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        })

        return {"access_token": token}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
        
import traceback

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    try:

        new_user = create_user(
            db,
            user.email,
            user.password,
            user.first_name,
            user.last_name
        )

        if not new_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        return {"message": "User registered successfully"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/forgot-password")
def forgot_password_endpoint(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return forgot_password(db, data.email)

@router.post("/reset-password")
def reset_password_route(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        return reset_password(db, data.token, data.new_password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))