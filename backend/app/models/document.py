from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    title = Column(String(150), nullable=False)
    slug = Column(String(150), nullable=False)
    content = Column(Text, nullable=True)  # markdown/html
    status = Column(String(20), default="draft")  # draft/published
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    topic = relationship("Topic", back_populates="documents")
    files = relationship("File", back_populates="document", cascade="all, delete")
    tags = relationship("Tag", secondary="document_tags", back_populates="documents")
    comments = relationship("Comment", back_populates="document", cascade="all, delete")
    views = relationship("View", back_populates="document", cascade="all, delete")