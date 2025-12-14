// メッセージデータ型定義
export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    // ストリーミング状態管理
    isStreaming?: boolean;
    // 将来の拡張用
    metadata?: Record<string, unknown>;
}

// メッセージ作成用の型
export type CreateMessageData = Omit<Message, 'id' | 'timestamp'>;
