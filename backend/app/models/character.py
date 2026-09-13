from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    level = Column(Integer, default=1, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    gold = Column(Integer, default=0, nullable=False)
    intellect = Column(Integer, default=10, nullable=False)
    strength = Column(Integer, default=10, nullable=False)
    vitality = Column(Integer, default=10, nullable=False)
    wisdom = Column(Integer, default=10, nullable=False)
    discipline = Column(Integer, default=10, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="character")
