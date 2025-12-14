'use client';

import { useState } from 'react';
import { chatAPIClient } from '../lib/api/client';

/**
 * ストリーミングチャット処理のカスタムフック
 */
export function useStreaming() {
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const streamMessage = async (
        conversationId: string,
        message: string,
        onComplete: (content: string) => void
    ) => {
        try {
            setIsStreaming(true);
            setStreamingContent('');
            setError(null);

            let fullContent = '';

            for await (const chunk of chatAPIClient.streamChat({
                conversationId,
                message,
                stream: true,
            })) {
                if (chunk.done) {
                    break;
                }

                fullContent += chunk.content;
                setStreamingContent(fullContent);
            }

            setIsStreaming(false);
            onComplete(fullContent);
        } catch (err) {
            setIsStreaming(false);
            const errorMessage = err instanceof Error ? err.message : 'ストリーミング中にエラーが発生しました';
            setError(errorMessage);
            console.error('Streaming error:', err);
        }
    };

    const cancelStream = () => {
        setIsStreaming(false);
        setStreamingContent('');
    };

    return {
        isStreaming,
        streamingContent,
        error,
        streamMessage,
        cancelStream,
    };
}
