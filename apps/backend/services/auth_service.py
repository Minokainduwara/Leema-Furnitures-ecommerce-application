from sqlalchemy.orm import Session
from models.user import User
from utils.security import hash_password
from datetime import datetime, timedelta
from utils.security import generate_reset_token
from utils.security import hash_password

def create_user(db: Session, email: str, password: str, first_name: str, last_name: str):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        return None

    new_user = User(
        email=email,
        password=hash_password(password),
        first_name=first_name,
        last_name=last_name,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def forgot_password(db, email: str):
    user = db.query(User).filter(User.email == email).first()

    if user:
        token = generate_reset_token()
        expiry = datetime.utcnow() + timedelta(minutes=15)

        user.reset_token = token
        user.reset_token_expiry = expiry

        db.commit()

        reset_link = f"http://localhost:5173/reset-password?token={token}"

        print("\n🔐 PASSWORD RESET LINK:")
        print(reset_link)
        print("\n")

    return {"message": "If this email exists, a reset link has been sent"}


def reset_password(db, token: str, new_password: str):
    user = db.query(User).filter(User.reset_token == token).first()

    if not user:
        raise Exception("Invalid token")

    if user.reset_token_expiry < datetime.utcnow():
        raise Exception("Token expired")

    user.password = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return {"message": "Password reset successful"}


def admin_create_user(db, email, password, first_name, last_name, role):

    existing = db.query(User).filter(User.email == email).first()

    if existing:
        return None

    new_user = User(
        email=email,
        password=hash_password(password),
        first_name=first_name,
        last_name=last_name,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user