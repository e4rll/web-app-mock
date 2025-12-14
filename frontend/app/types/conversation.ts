// 会話データ型定義
import { Message } from './message';

export interface Conversation {
  id: string;           // UUID v4
  title: string;        // 自動生成または最初のメッセージから
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  // 将来の拡張用
  userId?: string;      // 認証実装時に使用
  isShared?: boolean;   // 共有機能実装時に使用
}

// 会話作成用の型（IDとタイムスタンプは自動生成）
export type CreateConversationData = Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>;

// 会話更新用の型
export type UpdateConversationData = Partial<Omit<Conversation, 'id' | 'createdAt'>>;

// 会話を日付でグループ化するための型
export interface ConversationGroup {
  label: string;        // '今日', '昨日', '7日以内', 'それ以前'
  conversations: Conversation[];
}
