'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { ChatContainer } from '@/app/components/chat/ChatContainer';
import { Conversation } from '@/app/types/conversation';
import { conversationRepository } from '@/app/lib/storage';

export default function ConversationPage() {
    const params = useParams();
    const conversationId = params.id as string;
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadConversation = async () => {
            try {
                setLoading(true);
                const data = await conversationRepository.getById(conversationId);
                setConversation(data);
            } catch (error) {
                console.error('Failed to load conversation:', error);
            } finally {
                setLoading(false);
            }
        };

        if (conversationId) {
            loadConversation();
        }
    }, [conversationId]);

    if (loading) {
        return (
            <MainLayout currentConversationId={conversationId}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
                </div>
            </MainLayout>
        );
    }

    if (!conversation) {
        return (
            <MainLayout currentConversationId={conversationId}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            会話が見つかりません
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            この会話は削除されたか、存在しません
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentConversationId={conversationId}>
            <ChatContainer conversation={conversation} key={conversation.id} />
        </MainLayout>
    );
}
