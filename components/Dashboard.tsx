
import React, { useState, useEffect, useCallback } from 'react';
import StatCard from './StatCard';
import ContactTable from './ContactTable';
import ConfirmationModal from './ConfirmationModal';
import { getContactsAndStats, clearAllContacts } from '../services/apiService';
import type { Contact, ReportStats } from '../types';
import { RefreshIcon, SentIcon, PendingIcon, ErrorIcon, TotalIcon } from './icons/Icons';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { stats, contacts } = await getContactsAndStats();
      setStats(stats);
      setContacts(contacts);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearContacts = async () => {
    setClearing(true);
    try {
      await clearAllContacts();
      await fetchData(); // Refresh data after clearing
      setShowClearModal(false);
    } catch (error) {
      console.error("Failed to clear contacts", error);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Relatórios</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowClearModal(true)} 
            disabled={clearing || contacts.length === 0}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg shadow-sm disabled:opacity-50 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{clearing ? 'Limpando...' : 'Limpar Contatos'}</span>
          </button>
          <button 
            onClick={() => fetchData()} 
            disabled={loading} 
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-all"
          >
            <RefreshIcon loading={loading} />
            <span className="ml-2">{loading ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <p className="dark:text-gray-300">Carregando estatísticas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Enviados" value={stats?.sent ?? 0} icon={<SentIcon />} color="text-green-500" />
          <StatCard title="Pendentes" value={stats?.pending ?? 0} icon={<PendingIcon />} color="text-yellow-500" />
          <StatCard title="Erros" value={stats?.error ?? 0} icon={<ErrorIcon />} color="text-red-500" />
          <StatCard title="Total" value={stats?.total ?? 0} icon={<TotalIcon />} color="text-blue-500" />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Histórico de Envios</h2>
        <ContactTable contacts={contacts} loading={loading && contacts.length === 0} />
      </div>

      {showClearModal && (
        <ConfirmationModal
          title="Limpar Todos os Contatos"
          message="Tem certeza que deseja remover todos os contatos dos relatórios? Esta ação não pode ser desfeita."
          confirmText="Sim, Limpar Tudo"
          cancelText="Cancelar"
          onConfirm={handleClearContacts}
          onCancel={() => setShowClearModal(false)}
          isLoading={clearing}
          type="danger"
        />
      )}
    </div>
  );
};

export default Dashboard;
