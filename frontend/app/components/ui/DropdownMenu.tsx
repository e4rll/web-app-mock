'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownMenuProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right';
}

interface DropdownItemProps {
    onClick: () => void;
    icon?: ReactNode;
    label: string;
    variant?: 'default' | 'danger';
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100`}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export function DropdownItem({ onClick, icon, label, variant = 'default' }: DropdownItemProps) {
    return (
        <button
            onClick={() => {
                onClick();
                // 親のDropdownを閉じるためにイベント伝播が必要な場合は注意。
                // ここではクリック処理を実行するだけに留める。
            }}
            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${variant === 'danger'
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {label}
        </button>
    );
}
