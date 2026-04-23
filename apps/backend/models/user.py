from sqlalchemy import Column, Integer, String, TIMESTAMP
from database import Base
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2) 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role = Column(String(50), default="user")
    created_at = Column(TIMESTAMP)

    reset_token = Column(String(255), nullable=True)
    reset_token_expiry = Column(TIMESTAMP, nullable=True)