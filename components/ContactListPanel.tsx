import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Contact {
  id: number;
  nome: string;
  numero: string;
  status: string;
  data_envio?: string;
}

interface ContactListPanelProps {
  listId: number;
}

const ContactListPanel: React.FC<ContactListPanelProps> = ({ listId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lists/${listId}/contacts`);
      setContacts(res.data);
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [listId]);

  const handleAddContact = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !numero.trim()) return;
    setLoading(true);
    try {
      await api.post(`/lists/${listId}/contact`, { nome, numero });
      setNome('');
      setNumero('');
      fetchContacts();
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  const handleCsvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUploadCsv = async () => {
    if (!csvFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      await api.post(`/lists/${listId}/upload`, formData);
      setCsvFile(null);
      fetchContacts();
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadModel = () => {
    window.open('/api/lists/csv-model', '_blank');
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Excluir este contato?')) return;
    setLoading(true);
    try {
      await api.delete(`/lists/${listId}/contacts/${id}`);
      fetchContacts();
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Contatos da Lista</h3>
      <form onSubmit={handleAddContact} className="flex gap-2 mb-4">
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border px-2 py-1 rounded" />
        <input type="text" value={numero} onChange={e => setNumero(e.target.value)} placeholder="Número" className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Adicionar</button>
      </form>
      <div className="flex gap-2 mb-4">
        <input type="file" accept=".csv" onChange={handleCsvChange} />
        <button onClick={handleUploadCsv} className="bg-green-600 text-white px-3 py-1 rounded">Importar CSV</button>
        <button onClick={handleDownloadModel} className="bg-gray-600 text-white px-3 py-1 rounded">Baixar Modelo CSV</button>
      </div>
      {loading ? <p>Carregando...</p> : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Número</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.nome}</td>
                <td>{contact.numero}</td>
                <td>{contact.status}</td>
                <td>
                  <button onClick={() => handleDeleteContact(contact.id)} className="text-red-600">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactListPanel;
