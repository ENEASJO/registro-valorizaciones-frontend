import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      <div className="relative w-5 h-5">
        {/* Icono del sol (modo claro) */}
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-0 scale-75 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          }`}
        />

        {/* Icono de la luna (modo oscuro) */}
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-0 scale-75 -rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          }`}
        />
      </div>

      {/* Efecto de resplandor */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity ${
        theme === 'dark' ? 'from-blue-400 to-purple-400' : ''
      }`} />
    </button>
  );
};

export default ThemeToggle;