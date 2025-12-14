from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    conversationId: str
    message: str
    userId: Optional[str] = None
    stream: bool = True

class StreamResponse(BaseModel):
    content: str
    done: bool = False
