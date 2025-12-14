'use client';

import { Message as MessageType } from '@/app/types/message';
import { UserAvatar } from './UserAvatar';
import { AIAvatar } from './AIAvatar';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageProps {
    message: MessageType;
}

export function Message({ message }: MessageProps) {
    const isUser = message.role === 'user';
    const isStreaming = message.isStreaming;

    return (
        <div className={`py-6 px-4 ${isUser ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
            <div className="max-w-4xl mx-auto flex gap-6">
                {/* アバター */}
                <div className="flex-shrink-0">
                    {isUser ? <UserAvatar /> : <AIAvatar />}
                </div>

                {/* メッセージコンテンツ */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {isUser ? 'あなた' : 'AI アシスタント'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    <div className="text-gray-800 dark:text-gray-200">
                        {isUser ? (
                            // ユーザーメッセージはプレーンテキスト
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        ) : (
                            // AIメッセージはマークダウンレンダリング
                            <>
                                <MarkdownRenderer content={message.content} />
                                {isStreaming && (
                                    <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
