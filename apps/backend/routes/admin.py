from fastapi import APIRouter, Depends, HTTPException
from auth import require_role
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import AdminCreateUserRequest
from services.auth_service import admin_create_user

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/admin")
def admin_only(user=Depends(require_role("admin"))):
    return {"message": "Welcome Admin"}


@router.post("/create-user")
def create_user_by_admin(
    data: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin")) 
):
    new_user = admin_create_user(
        db,
        data.email,
        data.password,
        data.first_name,
        data.last_name,
        data.role
    )

    if not new_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    return {"message": f"{data.role} created successfully"}