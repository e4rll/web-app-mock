import Image from 'next/image';

export function AIAvatar() {
    return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Image
                src="/avatars/ai.png"
                alt="AI Assistant"
                width={32}
                height={32}
                className="object-cover"
            />
        </div>
    );
}
