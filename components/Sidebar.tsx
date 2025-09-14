
import React from 'react';
import type { View } from '../types';
import { SendIcon, ReportIcon, SettingsIcon, WhatsAppIcon } from './icons/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Relatórios', icon: <ReportIcon /> },
    { id: 'send', label: 'Enviar Mensagem', icon: <SendIcon /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon /> },
  ];

  const baseClasses = "flex items-center w-full p-3 my-1 rounded-lg text-gray-200 hover:bg-green-600 transition-colors duration-200";
  const activeClasses = "bg-green-700 font-semibold";

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <WhatsAppIcon />
        <h1 className="ml-3 text-xl font-bold">WP Disparador</h1>
      </div>
      <nav className="flex-1 p-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={`${baseClasses} ${currentView === item.id ? activeClasses : ''}`}
          >
            {item.icon}
            <span className="ml-4">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
        <p>WP Disparador Evolution</p>
        <p>&copy; 2024</p>
      </div>
    </aside>
  );
};

export default Sidebar;
