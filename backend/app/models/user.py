from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(256), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    full_name = Column(String(128), nullable=False)
    role = Column(
        String(64),
        nullable=False,
        default="citizen"
    )  # government_official, citizen, investor, business_operator, ngo_member, system_admin
    department_or_org = Column(String(128), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)

    # Relationships
    proposed_policies = relationship(
        "DevelopmentPolicy",
        foreign_keys="DevelopmentPolicy.created_by_user_id",
        back_populates="created_by"
    )
    approved_policies = relationship(
        "DevelopmentPolicy",
        foreign_keys="DevelopmentPolicy.approved_by_user_id",
        back_populates="approved_by"
    )
    civic_actions = relationship(
        "CivicAction",
        foreign_keys="CivicAction.user_id",
        back_populates="user"
    )
    verified_actions = relationship(
        "CivicAction",
        foreign_keys="CivicAction.verified_by_user_id",
        back_populates="verified_by"
    )
    civic_credits = relationship(
        "CivicCredit",
        back_populates="user"
    )
