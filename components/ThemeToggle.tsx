
import React from 'react';

interface ThemeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`${
        enabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800`}
      role="switch"
      aria-checked={enabled}
      id="dark-mode-toggle"
    >
      <span className="sr-only">Ativar modo escuro</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
  );
};

export default ThemeToggle;
