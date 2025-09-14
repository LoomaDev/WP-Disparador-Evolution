
import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings, testApiConnection } from '../services/apiService';
import type { EvolutionSettings } from '../types';
import { EyeIcon, EyeOffIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';
import ThemeToggle from './ThemeToggle';
import InstanceManager from './InstanceManager';

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

interface SettingsProps {
  theme: string;
  toggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, toggleTheme }) => {
  const [settings, setSettings] = useState<EvolutionSettings>({ 
    apiUrl: '', 
    apiKey: '', 
    globalApiKey: '',
    defaultMessage: '',
    instances: [],
    selectedInstance: undefined
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showGlobalApiKey, setShowGlobalApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(settings);
    setIsSaving(false);
    // You can add a success toast/message here
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    const result = await testApiConnection(settings);
    setTestMessage(result.message);
    setTestStatus(result.success ? 'success' : 'error');
    setTimeout(() => setTestStatus('idle'), 5000);
  };

  if (isLoading) {
    return <p className="dark:text-gray-300">Carregando configurações...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Configurações</h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">API Evolution</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL da API Evolution</label>
            <input
              type="url"
              id="apiUrl"
              name="apiUrl"
              value={settings.apiUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-200"
              placeholder="https://exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="globalApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave Global da API (Global API Key)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showGlobalApiKey ? 'text' : 'password'}
                id="globalApiKey"
                name="globalApiKey"
                value={settings.globalApiKey}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-200"
                placeholder="Chave global para gerenciar instâncias"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" onClick={() => setShowGlobalApiKey(!showGlobalApiKey)} className="text-gray-400 hover:text-gray-600">
                  {showGlobalApiKey ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave da API da Instância (Instance API Key)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="apiKey"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-200"
                placeholder="Chave da instância específica"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="text-gray-400 hover:text-gray-600">
                  {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
           <div>
            <label htmlFor="defaultMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem Padrão</label>
            <textarea
              id="defaultMessage"
              name="defaultMessage"
              value={settings.defaultMessage}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-200"
              placeholder="Olá {{nome}}!"
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {testStatus === 'testing' ? 'Testando...' : 'Testar Conexão'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {testStatus !== 'idle' && (
            <div className={`mt-4 p-3 rounded-md flex items-center text-sm ${
                testStatus === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
            }`}>
                {testStatus === 'success' ? <CheckCircleIcon /> : <XCircleIcon />}
                <span className="ml-2">{testMessage}</span>
            </div>
          )}
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <InstanceManager />
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Aparência</h2>
        <div className="flex items-center justify-between">
            <label htmlFor="dark-mode-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Modo Escuro
            </label>
            <ThemeToggle enabled={theme === 'dark'} onToggle={toggleTheme} />
        </div>
      </div>

    </div>
  );
};

export default Settings;
