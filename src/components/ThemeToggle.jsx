'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Karanlık/Aydınlık Modu Değiştir"
      title={theme === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-hurriyet-red dark:hover:text-hurriyet-red hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-neutral-200 dark:border-neutral-700"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
