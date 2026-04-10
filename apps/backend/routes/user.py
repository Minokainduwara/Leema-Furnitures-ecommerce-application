from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import verify_token
from database import get_db
from models.user import UserCreate
from services.auth_service import create_user
from services.user_service import get_user_role

router = APIRouter()


@router.get("/protected")
def protected(user=Depends(verify_token)):
    return {
        "message": "You are authenticated",
        "user_id": user["user_id"]   # changed
    }

@router.post("/create-user")
def create_user_route(
    data: UserCreate,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        email = user.get("email")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found")

        result = create_user(
            db,
            email=email,
            first_name=data.first_name,
            last_name=data.last_name,
            password=data.password   # make sure your schema has this
        )

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile")
def get_profile(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        role = get_user_role(db, user["user_id"])   # changed
        return {"role": role}

    except Exception as e:
        return {"error": str(e)}