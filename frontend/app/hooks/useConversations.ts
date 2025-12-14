'use client';

import { useState, useEffect } from 'react';
import { Conversation, CreateConversationData, UpdateConversationData } from '../types/conversation';
import { conversationRepository } from '../lib/storage';

/**
 * 会話管理カスタムフック
 */
export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 初回ロード
    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await conversationRepository.getAll();
            // 更新日時の降順でソート
            data.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
            setConversations(data);
            setError(null);
        } catch (err) {
            setError('会話の読み込みに失敗しました');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createConversation = async (data: CreateConversationData) => {
        try {
            const newConversation = await conversationRepository.create(data);
            setConversations(prev => [newConversation, ...prev]);
            return newConversation;
        } catch (err) {
            setError('会話の作成に失敗しました');
            console.error(err);
            throw err;
        }
    };

    const updateConversation = async (id: string, data: UpdateConversationData) => {
        try {
            const updated = await conversationRepository.update(id, data);
            setConversations(prev =>
                prev.map(c => (c.id === id ? updated : c))
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            );
            return updated;
        } catch (err) {
            setError('会話の更新に失敗しました');
            console.error(err);
            throw err;
        }
    };

    const deleteConversation = async (id: string) => {
        try {
            await conversationRepository.delete(id);
            setConversations(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError('会話の削除に失敗しました');
            console.error(err);
            throw err;
        }
    };

    return {
        conversations,
        loading,
        error,
        loadConversations,
        createConversation,
        updateConversation,
        deleteConversation,
    };
}
