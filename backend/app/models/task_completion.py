from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base


class TaskCompletion(Base):
    __tablename__ = "task_completions"
    __table_args__ = (
        UniqueConstraint("task_id", "completed_date", name="uq_task_completion_task_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    completed_date = Column(Date, server_default=func.current_date(), nullable=False)
    what_you_did = Column(Text, nullable=True)
    evidence_image_url = Column(String(512), nullable=True)
    xp_earned = Column(Integer, default=0, nullable=False)
    gold_earned = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="task_completions")
    task = relationship("Task", back_populates="completions")
    mission = relationship("Mission", back_populates="task_completions")

