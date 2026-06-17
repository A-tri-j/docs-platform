from pydantic import BaseModel
from datetime import datetime

class FileOut(BaseModel):
    id: int
    document_id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True