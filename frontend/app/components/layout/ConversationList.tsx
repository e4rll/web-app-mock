'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Conversation } from '@/app/types/conversation';
import { groupConversationsByDate } from '@/app/lib/utils/conversation';
import { IconButton } from '../ui/IconButton';
import { Modal } from '../ui/Modal';

interface ConversationListProps {
    conversations: Conversation[];
    currentConversationId?: string;
    onDelete: (id: string) => void;
}

export function ConversationList({ conversations, currentConversationId, onDelete }: ConversationListProps) {
    const groups = groupConversationsByDate(conversations);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const handleDeleteConfirm = () => {
        if (deleteTargetId) {
            onDelete(deleteTargetId);
            setDeleteTargetId(null);
        }
    };

    if (conversations.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                会話履歴がありません
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto py-2">
                {groups.map((group) => (
                    <div key={group.label} className="mb-4">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            {group.label}
                        </div>
                        <div className="space-y-1">
                            {group.conversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    isActive={conversation.id === currentConversationId}
                                    onDeleteClick={() => setDeleteTargetId(conversation.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                title="会話の削除"
                primaryAction={{
                    label: '削除する',
                    onClick: handleDeleteConfirm,
                    variant: 'danger',
                }}
                secondaryAction={{
                    label: 'キャンセル',
                    onClick: () => setDeleteTargetId(null),
                }}
            >
                <p>この会話を削除してもよろしいですか？<br />この操作は取り消せません。</p>
            </Modal>
        </>
    );
}

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onDeleteClick: () => void;
}

function ConversationItem({ conversation, isActive, onDeleteClick }: ConversationItemProps) {
    return (
        <div
            className={`group relative mx-2 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
        >
            <Link
                href={`/c/${conversation.id}`}
                className="block px-3 py-2 pr-10"
            >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {conversation.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.messages.length} メッセージ
                </div>
            </Link>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton
                    icon={<TrashIcon />}
                    label="削除"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteClick();
                    }}
                    className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                />
            </div>
        </div>
    );
}

function TrashIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}
