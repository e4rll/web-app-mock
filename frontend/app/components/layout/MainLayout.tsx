'use client';

import { ReactNode } from 'react';
import { Sidebar, MenuIcon } from './Sidebar';
import { IconButton } from '../ui/IconButton';
import { useConversations } from '@/app/hooks/useConversations';
import { useSidebar } from '@/app/hooks/useSidebar';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownItem } from '../ui/DropdownMenu';
import { exportConversationAsJSON, exportConversationAsMarkdown, downloadAsFile } from '@/app/lib/utils/conversation';

interface MainLayoutProps {
    children: ReactNode;
    currentConversationId?: string;
}

export function MainLayout({ children, currentConversationId }: MainLayoutProps) {
    const { conversations, deleteConversation } = useConversations();
    const { isOpen, toggle } = useSidebar();
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            await deleteConversation(id);
            // 削除した会話を表示中だった場合は、トップページへ
            if (id === currentConversationId) {
                router.push('/');
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };

    const handleExport = (format: 'json' | 'markdown') => {
        const conversation = conversations.find(c => c.id === currentConversationId);
        if (!conversation) return;

        if (format === 'json') {
            const json = exportConversationAsJSON(conversation);
            downloadAsFile(json, `${conversation.title}.json`, 'application/json');
        } else {
            const markdown = exportConversationAsMarkdown(conversation);
            downloadAsFile(markdown, `${conversation.title}.md`, 'text/markdown');
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-950">
            {/* サイドバー */}
            <Sidebar
                isOpen={isOpen}
                conversations={conversations}
                currentConversationId={currentConversationId}
                onDeleteConversation={handleDelete}
            />

            {/* メインコンテンツ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ヘッダー */}
                <header className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={<MenuIcon />}
                            label={isOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
                            onClick={toggle}
                        />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            SaaS型 Webアプリケーション Mock
                        </h1>
                    </div>

                    {/* アクションメニュー (現在の会話がある場合のみ) */}
                    {currentConversationId && (
                        <DropdownMenu
                            trigger={
                                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                </button>
                            }
                        >
                            <DropdownItem
                                label="Markdownでエクスポート"
                                onClick={() => handleExport('markdown')}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                }
                            />
                            <DropdownItem
                                label="JSONでエクスポート"
                                onClick={() => handleExport('json')}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                }
                            />
                            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                            <DropdownItem
                                label="会話を削除"
                                variant="danger"
                                onClick={() => handleDelete(currentConversationId)}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                            />
                        </DropdownMenu>
                    )}
                </header>

                {/* チャットエリア */}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
