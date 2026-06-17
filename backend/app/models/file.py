from sqlalchemy import Column, Integer, String, BigInteger, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(BigInteger, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    document = relationship("Document", back_populates="files")