import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GlobalSettings: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [globalApiKey, setGlobalApiKey] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setApiUrl(res.data.api_url || '');
        setGlobalApiKey(res.data.global_api_key || '');
        setDefaultMessage(res.data.default_message || '');
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(''); setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/settings', { apiUrl, globalApiKey, defaultMessage }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Configurações salvas com sucesso!');
    } catch (err: any) {
      setError('Erro ao salvar configurações.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">Configurações Globais</h2>
      <form onSubmit={handleSave}>
        <label className="block mb-2">URL da API Evolution</label>
        <input type="text" value={apiUrl} onChange={e => setApiUrl(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <label className="block mb-2">API Key Global</label>
        <input type="text" value={globalApiKey} onChange={e => setGlobalApiKey(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <label className="block mb-2">Mensagem Padrão</label>
        <input type="text" value={defaultMessage} onChange={e => setDefaultMessage(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Salvar</button>
      </form>
    </div>
  );
};

export default GlobalSettings;
