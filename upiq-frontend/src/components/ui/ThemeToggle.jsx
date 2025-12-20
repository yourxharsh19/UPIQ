import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 scale-100" />
            ) : (
                <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 scale-100" />
            )}
        </button>
    );
};

export default ThemeToggle;
