
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SendMessage from './components/SendMessage';
import Settings from './components/Settings';
import Login from './components/Login';
import GlobalSettings from './components/GlobalSettings';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'send':
        return <SendMessage />;
      case 'settings':
        return <Settings theme={theme} toggleTheme={toggleTheme} />;
      case 'global-settings':
        return <GlobalSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (!localStorage.getItem('token')) {
    return <Login />;
  }
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
