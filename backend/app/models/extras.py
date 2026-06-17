from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import relationship
from app.database import Base

document_tags = Table(
    "document_tags",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("document_id", Integer, ForeignKey("documents.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
)

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)

    documents = relationship("Document", secondary=document_tags, back_populates="tags")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    document = relationship("Document", back_populates="comments")


class View(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    document = relationship("Document", back_populates="views")