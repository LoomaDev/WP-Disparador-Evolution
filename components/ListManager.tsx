import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactListPanel from './ContactListPanel';

interface List {
  id: number;
  name: string;
  created_at: string;
}

const ListManager: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  // TODO: Adicionar autenticação (token)
  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await api.get('/lists');
      setLists(res.data);
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setLoading(true);
    try {
      await api.post('/lists', { name: newListName });
      setNewListName('');
      fetchLists();
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir esta lista?')) return;
    setLoading(true);
    try {
      await api.delete(`/lists/${id}`);
      setSelectedList(null);
      fetchLists();
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Listas de Disparo</h2>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
          placeholder="Nome da nova lista"
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={handleCreateList} className="bg-green-600 text-white px-4 py-2 rounded">Criar</button>
      </div>
      {loading ? <p>Carregando...</p> : (
        <ul className="space-y-2">
          {lists.map(list => (
            <li key={list.id} className={`flex justify-between items-center p-3 rounded ${selectedList?.id === list.id ? 'bg-green-100' : 'bg-gray-100'}`}>
              <span onClick={() => setSelectedList(list)} className="cursor-pointer font-medium">{list.name}</span>
              <button onClick={() => handleDeleteList(list.id)} className="text-red-600">Excluir</button>
            </li>
          ))}
        </ul>
      )}
      {selectedList && (
        <ContactListPanel listId={selectedList.id} />
      )}
    </div>
  );
};

export default ListManager;
