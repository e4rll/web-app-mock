// API通信用の型定義

// チャットリクエスト
export interface ChatRequest {
    conversationId: string;
    message: string;
    // 将来の拡張用
    userId?: string;
    stream?: boolean;
}

// チャットレスポンス（非ストリーミング）
export interface ChatResponse {
    conversationId: string;
    message: string;
    timestamp: string;
}

// ストリーミングチャンク
export interface StreamChunk {
    content: string;
    done?: boolean;
}

// エラーレスポンス
export interface APIError {
    error: string;
    message: string;
    statusCode: number;
}
