import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest, StreamResponse
from app.services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/chat/stream")
async def stream_chat(request: ChatRequest):
    async def event_generator():
        try:
            async for chunk in chat_service.get_streaming_response(request.message):
                data = StreamResponse(content=chunk).model_dump_json()
                yield f"data: {data}\n\n"
            
            # 完了シグナル
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"Error: {e}")
            error_data = json.dumps({"error": str(e)})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
