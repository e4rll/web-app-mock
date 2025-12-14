import { ChatRequest, ChatResponse, StreamChunk, APIError } from '../../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * APIエラーハンドリング
 */
class APIErrorHandler extends Error {
    constructor(
        public statusCode: number,
        public error: string,
        message: string
    ) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * チャットAPI通信クライアント
 */
export class ChatAPIClient {
    /**
     * ストリーミングでチャットメッセージを送信
     */
    async *streamChat(request: ChatRequest): AsyncGenerator<StreamChunk, void, unknown> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 将来の認証対応
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const error = await response.json() as APIError;
                throw new APIErrorHandler(response.status, error.error, error.message);
            }

            if (!response.body) {
                throw new Error('Response body is null');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                // デコードして buffer に追加
                buffer += decoder.decode(value, { stream: true });

                // Server-Sent Events (SSE) 形式をパース
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // 最後の不完全な行はバッファに残す

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6); // 'data: ' を除去

                        if (data === '[DONE]') {
                            yield { content: '', done: true };
                            return;
                        }

                        try {
                            const chunk = JSON.parse(data) as StreamChunk;
                            yield chunk;
                        } catch (e) {
                            console.error('Failed to parse SSE data:', data, e);
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof APIErrorHandler) {
                throw error;
            }
            throw new Error(`Failed to stream chat: ${error}`);
        }
    }

    /**
     * 非ストリーミングでチャットメッセージを送信
     */
    async sendChat(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...request, stream: false }),
            });

            if (!response.ok) {
                const error = await response.json() as APIError;
                throw new APIErrorHandler(response.status, error.error, error.message);
            }

            return await response.json() as ChatResponse;
        } catch (error) {
            if (error instanceof APIErrorHandler) {
                throw error;
            }
            throw new Error(`Failed to send chat: ${error}`);
        }
    }
}

export const chatAPIClient = new ChatAPIClient();
