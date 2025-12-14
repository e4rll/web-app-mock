'use client';

import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        const trimmed = input.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            setInput('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-end gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-3 shadow-sm transition-all duration-200">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="メッセージを入力... (Shift+Enterで改行)"
                        disabled={disabled}
                        className="flex-1 max-h-[200px] min-h-[24px] bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none leading-relaxed py-1"
                        rows={1}
                        style={{ height: 'auto', minHeight: '24px' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={disabled || !input.trim()}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:cursor-default mb-0.5"
                        aria-label="送信"
                    >
                        <svg
                            className="w-4 h-4 transform rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </div>
                <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                    AIは不正確な情報を生成する可能性があります。重要な情報は確認してください。
                </div>
            </div>
        </div>
    );
}
