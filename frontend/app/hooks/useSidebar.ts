'use client';

import { useState, useEffect } from 'react';

/**
 * サイドバーの開閉状態を管理するカスタムフック
 */
export function useSidebar() {
    const [isOpen, setIsOpen] = useState(true);

    // localStorageから初期状態を復元
    useEffect(() => {
        const saved = localStorage.getItem('moc_sidebar_open');
        if (saved !== null) {
            // eslint-disable-next-line
            setIsOpen(JSON.parse(saved));
        }
    }, []);

    // 状態変更時にlocalStorageに保存
    const toggle = () => {
        setIsOpen(prev => {
            const newValue = !prev;
            localStorage.setItem('moc_sidebar_open', JSON.stringify(newValue));
            return newValue;
        });
    };

    return { isOpen, toggle };
}
