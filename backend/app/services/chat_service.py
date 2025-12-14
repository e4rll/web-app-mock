import os
import asyncio
from typing import AsyncGenerator
from openai import AsyncOpenAI
from dotenv import load_dotenv

# 環境変数の読み込み（明示的に指定）
# backend/app/services/chat_service.py -> backend/app/services -> backend/app -> backend -> root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env'))

class ChatService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY is not set")
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=self.api_key)
        # 安くて速いモデル
        self.model = "gpt-4o-mini"

    async def get_streaming_response(self, message: str) -> AsyncGenerator[str, None]:
        """
        OpenAI APIを使用してストリーミング応答を生成
        エラー時はモック応答にフォールバック
        """
        # APIキーがない、またはクライアント初期化失敗時は即モック
        if not self.client:
            async for chunk in self._get_mock_response(message, "[システム: APIキー未設定のためモック応答を表示します]"):
                yield chunk
            return

        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "あなたは役に立つAIアシスタントです。ユーザーの質問に親切かつ簡潔に答えてください。Markdown形式で出力してください。"},
                    {"role": "user", "content": message}
                ],
                stream=True,
            )

            async for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content

        except Exception as e:
            print(f"OpenAI API Error: {e}")
            error_msg = str(e)
            
            # クオータ不足(429)などの場合、ユーザーに通知しつつモックへ
            fallback_reason = "エラーが発生しました"
            if "insufficient_quota" in error_msg or "429" in error_msg:
                fallback_reason = "OpenAI APIのクレジット残高不足(429)"
            
            warning_text = f"\n\n> [!WARNING]\n> **{fallback_reason}** が発生したため、モック応答に切り替えます。\n\n"
            yield warning_text
            
            async for chunk in self._get_mock_response(message):
                yield chunk

    async def _get_mock_response(self, message: str, prefix: str = "") -> AsyncGenerator[str, None]:
        """
        AI応答のモック生成（ストリーミングフォールバック用）
        """
        if prefix:
            yield f"{prefix}\n\n"
            
        response_text = f"これは **モック応答** です。（入力: {message}）\n\nAPI連携に問題が発生した場合でも、このようにUIの動作確認を行えます。\n\n**確認事項**:\n- 課金状況を確認してください\n- APIキーを確認してください"
        
        chars = list(response_text)
        buffer = ""
        
        for char in chars:
            buffer += char
            if len(buffer) >= 2 or char == ' ':
                yield buffer
                buffer = ""
                await asyncio.sleep(0.05)
        
        if buffer:
            yield buffer

