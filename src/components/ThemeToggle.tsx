import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { db } from '../services/db';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => db.getTheme());

  useEffect(() => {
    // Sync with html tag
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    db.setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === 'dark' ? 'التبديل إلى الوضع النهاري (Light Mode)' : 'التبديل إلى الوضع الليلي (Dark Mode)'}
      aria-label="تبديل مظهر الموقع"
      className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-neutral-800/80 hover:bg-neutral-700 text-amber-400 border border-neutral-700'
          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
      } ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
