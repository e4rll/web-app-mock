import { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    label: string; // アクセシビリティ用
}

export function IconButton({ icon, label, className = '', ...props }: IconButtonProps) {
    return (
        <button
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${className}`}
            aria-label={label}
            title={label}
            {...props}
        >
            {icon}
        </button>
    );
}
