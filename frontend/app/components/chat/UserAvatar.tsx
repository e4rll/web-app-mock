import Image from 'next/image';

export function UserAvatar() {
    return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Image
                src="/avatars/user.png"
                alt="User"
                width={32}
                height={32}
                className="object-cover"
            />
        </div>
    );
}
