import { Conversation } from '../../types/conversation';

/**
 * 会話を日付別にグループ化するユーティリティ
 */
export function groupConversationsByDate(conversations: Conversation[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups = {
        today: [] as Conversation[],
        yesterday: [] as Conversation[],
        last7Days: [] as Conversation[],
        older: [] as Conversation[],
    };

    conversations.forEach(conversation => {
        const date = new Date(conversation.createdAt);
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (dateOnly.getTime() === today.getTime()) {
            groups.today.push(conversation);
        } else if (dateOnly.getTime() === yesterday.getTime()) {
            groups.yesterday.push(conversation);
        } else if (dateOnly >= sevenDaysAgo) {
            groups.last7Days.push(conversation);
        } else {
            groups.older.push(conversation);
        }
    });

    return [
        { label: '今日', conversations: groups.today },
        { label: '昨日', conversations: groups.yesterday },
        { label: '7日以内', conversations: groups.last7Days },
        { label: 'それ以前', conversations: groups.older },
    ].filter(group => group.conversations.length > 0);
}

/**
 * 会話のタイトルを生成（最初のユーザーメッセージから）
 */
export function generateConversationTitle(firstMessage: string, maxLength = 30): string {
    const trimmed = firstMessage.trim();
    if (trimmed.length <= maxLength) {
        return trimmed;
    }
    return trimmed.slice(0, maxLength) + '...';
}

/**
 * 会話をJSON形式でエクスポート
 */
export function exportConversationAsJSON(conversation: Conversation): string {
    return JSON.stringify(conversation, null, 2);
}

/**
 * 会話をMarkdown形式でエクスポート
 */
export function exportConversationAsMarkdown(conversation: Conversation): string {
    let markdown = `# ${conversation.title}\n\n`;
    markdown += `作成日時: ${conversation.createdAt.toLocaleString('ja-JP')}\n`;
    markdown += `更新日時: ${conversation.updatedAt.toLocaleString('ja-JP')}\n\n`;
    markdown += `---\n\n`;

    conversation.messages.forEach(message => {
        const role = message.role === 'user' ? '👤 ユーザー' : '🤖 AI';
        const timestamp = new Date(message.timestamp).toLocaleTimeString('ja-JP');
        markdown += `## ${role} (${timestamp})\n\n`;
        markdown += `${message.content}\n\n`;
    });

    return markdown;
}

/**
 * ファイルとしてダウンロード
 */
export function downloadAsFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
