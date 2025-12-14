'use client';

import { useRef, useEffect } from 'react';
import { Message as MessageType } from '@/app/types/message';
import { Message } from './Message';

interface MessageListProps {
    messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // 新しいメッセージが追加されたら自動スクロール
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        SaaS型 Webアプリケーション Mock
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        メッセージを入力して会話を始めましょう
                    </p>
                    <div className="grid gap-2">
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                            サンプルプロンプト:
                        </div>
                        <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-left">
                            「Reactの基本的な使い方を教えて」
                        </div>
                        <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-left">
                            「Pythonでファイルを読み込む方法は?」
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
