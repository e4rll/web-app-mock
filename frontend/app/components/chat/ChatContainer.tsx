'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message as MessageType } from '@/app/types/message';
import { Conversation } from '@/app/types/conversation';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useStreaming } from '@/app/hooks/useStreaming';
import { useConversations } from '@/app/hooks/useConversations';
import { generateConversationTitle } from '@/app/lib/utils/conversation';
import { useRouter } from 'next/navigation';

interface ChatContainerProps {
    conversation: Conversation | null;
}

export function ChatContainer({ conversation }: ChatContainerProps) {
    const [messages, setMessages] = useState<MessageType[]>(conversation?.messages || []);
    const { isStreaming, streamingContent, streamMessage } = useStreaming();
    const { createConversation, updateConversation } = useConversations();
    const router = useRouter();

    // conversationが変わったらメッセージを更新する処理は
    // 親コンポーネントがkeyを変更して再マウントすることで実現するため、
    // ここでのuseEffectによるstate更新は不要（かつLintエラーの原因）。

    // ストリーミング中の一時メッセージを表示
    const displayMessages: MessageType[] = isStreaming
        ? [
            ...messages,
            {
                id: 'streaming',
                conversationId: conversation?.id || '',
                role: 'assistant',
                content: streamingContent,
                timestamp: new Date(),
                isStreaming: true,
            },
        ]
        : messages;

    const handleSendMessage = async (content: string) => {
        try {
            let currentConversation = conversation;
            // メッセージ履歴のベースとなる配列（state由来）
            let currentMessages = [...messages];

            // ユーザーメッセージを作成
            const userMessage: MessageType = {
                id: uuidv4(),
                conversationId: currentConversation?.id || '', // 新規時は後でID更新が必要だが、表示上は一旦空でも許容、あるいは仮ID
                role: 'user',
                content,
                timestamp: new Date(),
            };

            // 新規会話の場合は作成
            if (!currentConversation) {
                const title = generateConversationTitle(content);
                // 仮IDを修正してメッセージ配列を作成
                // ID確定前だが、createConversationの戻り値を使うのでここでは配列準備のみ

                currentConversation = await createConversation({
                    title,
                    messages: [{ ...userMessage, conversationId: '' }], // サーバー側でID整合するが、念のため
                });

                if (!currentConversation) {
                    throw new Error('Failed to create conversation');
                }

                // 新しいIDをメッセージに適用
                userMessage.conversationId = currentConversation.id;
                currentMessages = [userMessage];

                // ここでページ遷移するとアンマウントされてストリーミングが止まるので、
                // 遷移はストリーミング完了後、またはバックグラウンドで行う。
                // 今回はストリーミング完了後に遷移する方針に変更。
            } else {
                // 既存会話の場合は更新
                currentMessages = [...currentMessages, userMessage];
                userMessage.conversationId = currentConversation!.id;

                await updateConversation(currentConversation!.id, {
                    messages: currentMessages,
                });
            }

            // 即座にUI反映
            setMessages(currentMessages);

            // この時点でcurrentConvers ationは必ず非null（新規作成済み or 既存）
            const conversationForStreaming = currentConversation!;

            // AIレスポンスをストリーミング
            await streamMessage(
                conversationForStreaming.id,
                content,
                async (aiContent) => {
                    // ストリーミング完了後、AIメッセージを保存
                    const aiMessage: MessageType = {
                        id: uuidv4(),
                        conversationId: conversationForStreaming.id,
                        role: 'assistant',
                        content: aiContent,
                        timestamp: new Date(),
                    };

                    // 重要: propsのconversation.messagesではなく、
                    // ユーザーメッセージ追加済みの currentMessages をベースにする
                    const finalMessages = [...currentMessages, aiMessage];

                    // 重複排除（念のためIDでユニーク化）
                    const uniqueMessages = Array.from(new Map(finalMessages.map(m => [m.id, m])).values());

                    setMessages(uniqueMessages);

                    await updateConversation(conversationForStreaming.id, {
                        messages: uniqueMessages,
                    });

                    // 新規会話だった場合、URLを更新して会話ページへ遷移
                    // (ストリーミング完了後に遷移することで中断を防ぐ)
                    if (!conversation) {
                        router.push(`/c/${conversationForStreaming.id}`);
                    }
                }
            );
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('メッセージの送信に失敗しました');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <MessageList messages={displayMessages} />
            <MessageInput onSend={handleSendMessage} disabled={isStreaming} />
        </div>
    );
}
