import { v4 as uuidv4 } from 'uuid';
import { Conversation, CreateConversationData, UpdateConversationData } from '../../types/conversation';
import { ConversationRepository } from './repository';

const STORAGE_KEY = 'moc_conversations';

/**
 * localStorage実装のConversationRepository
 */
export class LocalStorageConversationRepository implements ConversationRepository {
    async getAll(): Promise<Conversation[]> {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];

            const conversations = JSON.parse(data) as Conversation[];
            // Date型に復元
            return conversations.map(c => ({
                ...c,
                createdAt: new Date(c.createdAt),
                updatedAt: new Date(c.updatedAt),
                messages: c.messages.map(m => ({
                    ...m,
                    timestamp: new Date(m.timestamp),
                })),
            }));
        } catch (error) {
            console.error('Failed to load conversations from localStorage:', error);
            return [];
        }
    }

    async getById(id: string): Promise<Conversation | null> {
        const conversations = await this.getAll();
        const conversation = conversations.find(c => c.id === id);
        return conversation || null;
    }

    async create(data: CreateConversationData): Promise<Conversation> {
        const conversations = await this.getAll();

        const now = new Date();
        const newConversation: Conversation = {
            id: uuidv4(),
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        conversations.push(newConversation);
        await this.saveAll(conversations);

        return newConversation;
    }

    async update(id: string, data: UpdateConversationData): Promise<Conversation> {
        const conversations = await this.getAll();
        const index = conversations.findIndex(c => c.id === id);

        if (index === -1) {
            throw new Error(`Conversation with id ${id} not found`);
        }

        const updated: Conversation = {
            ...conversations[index],
            ...data,
            updatedAt: new Date(),
        };

        conversations[index] = updated;
        await this.saveAll(conversations);

        return updated;
    }

    async delete(id: string): Promise<void> {
        const conversations = await this.getAll();
        const filtered = conversations.filter(c => c.id !== id);
        await this.saveAll(filtered);
    }

    async deleteAll(): Promise<void> {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * 全会話をlocalStorageに保存
     */
    private async saveAll(conversations: Conversation[]): Promise<void> {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        } catch (error) {
            console.error('Failed to save conversations to localStorage:', error);
            throw new Error('Failed to save conversations. Storage quota may be exceeded.');
        }
    }
}

/**
 * デフォルトのリポジトリインスタンス
 * 将来的にはAPI実装に切り替え可能
 */
export const conversationRepository = new LocalStorageConversationRepository();
