from sqlalchemy.orm import Session
from models.user import User


def get_user_role(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    return user.role