import { Conversation, CreateConversationData, UpdateConversationData } from '../../types/conversation';

/**
 * 会話データアクセスの抽象インターフェース
 * 現在はlocalStorage実装、将来的にはAPI経由に切り替え可能
 */
export interface ConversationRepository {
    /**
     * 全会話を取得
     */
    getAll(): Promise<Conversation[]>;

    /**
     * IDで会話を取得
     */
    getById(id: string): Promise<Conversation | null>;

    /**
     * 新規会話を作成
     */
    create(data: CreateConversationData): Promise<Conversation>;

    /**
     * 会話を更新
     */
    update(id: string, data: UpdateConversationData): Promise<Conversation>;

    /**
     * 会話を削除
     */
    delete(id: string): Promise<void>;

    /**
     * 全会話を削除（エクスポート前のクリーンアップ等）
     */
    deleteAll(): Promise<void>;
}
