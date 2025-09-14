
import React from 'react';
import type { Contact } from '../types';
import { ContactStatus } from '../types';

interface ContactTableProps {
  contacts: Contact[];
  loading: boolean;
}

const StatusBadge: React.FC<{ status: ContactStatus }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
  const statusConfig = {
    [ContactStatus.Sent]: { text: 'Enviado', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    [ContactStatus.Pending]: { text: 'Pendente', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 animate-pulse' },
    [ContactStatus.Error]: { text: 'Erro', classes: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
  };

  const config = statusConfig[status] || { text: 'Desconhecido', classes: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300' };

  return (
    <span className={`${baseClasses} ${config.classes}`}>{config.text}</span>
  );
};

const ContactTable: React.FC<ContactTableProps> = ({ contacts, loading }) => {
  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Carregando contatos...</p>;
  }
  
  if (contacts.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum envio registrado ainda.</p>;
  }

  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleString('pt-BR');
    } catch {
        return dateString;
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Número</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data de Envio</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{contact.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.numero}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={contact.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(contact.data_envio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
