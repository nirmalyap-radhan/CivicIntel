from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=128)
    role: str = Field("citizen", description="Role of user")
    department_or_org: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=64)

    @field_validator("role")
    @classmethod
    def validate_public_registration_role(cls, v: str) -> str:
        # Prevent self-assignment of privileged roles during public signup
        allowed_self_roles = {"citizen", "business_operator", "investor", "ngo_member"}
        if v not in allowed_self_roles:
            raise ValueError(
                f"Cannot self-assign privileged role '{v}'. Privileged roles (government_official, system_admin) must be granted by administrators."
            )
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
