
import React, { useState, useEffect, useCallback } from 'react';
import StatCard from './StatCard';
import ContactTable from './ContactTable';
import { getContactsAndStats } from '../services/apiService';
import type { Contact, ReportStats } from '../types';
import { RefreshIcon, SentIcon, PendingIcon, ErrorIcon, TotalIcon } from './icons/Icons';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

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
        <button onClick={() => fetchData()} disabled={loading} className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-all">
          <RefreshIcon loading={loading} />
          <span className="ml-2">{loading ? 'Atualizando...' : 'Atualizar'}</span>
        </button>
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
    </div>
  );
};

export default Dashboard;
