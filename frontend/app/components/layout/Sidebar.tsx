'use client';

import Link from 'next/link';
import { ConversationList } from './ConversationList';
import { Conversation } from '@/app/types/conversation';
import { Button } from '../ui/Button';

interface SidebarProps {
    isOpen: boolean;
    conversations: Conversation[];
    currentConversationId?: string;
    onDeleteConversation: (id: string) => void;
}

export function Sidebar({ isOpen, conversations, currentConversationId, onDeleteConversation }: SidebarProps) {
    return (
        <>
            {/* オーバーレイ（モバイル用、今回は不要だが将来的に） */}
            {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )} */}

            {/* サイドバー */}
            <aside
                className={`flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'
                    } overflow-hidden whitespace-nowrap`}
                aria-hidden={!isOpen}
            >
                {/* 内部コンテンツの幅を固定して、親の幅変更時に中身が崩れないようにする */}
                <div className="w-72 min-w-[18rem] flex flex-col h-full">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700 shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            会話履歴
                        </h2>
                    </div>

                    {/* 新規会話ボタン */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                        <Link href="/">
                            <Button variant="primary" className="w-full">
                                + 新規会話
                            </Button>
                        </Link>
                    </div>

                    {/* 会話一覧 */}
                    <ConversationList
                        conversations={conversations}
                        currentConversationId={currentConversationId}
                        onDelete={onDeleteConversation}
                    />
                </div>
            </aside>
        </>
    );
}

// ハンバーガーメニューアイコン
export function MenuIcon() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}
