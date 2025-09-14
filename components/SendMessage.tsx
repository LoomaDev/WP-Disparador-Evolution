
import React, { useState, useEffect } from 'react';
import { sendBulkMessages } from '../services/apiService';
import { UploadIcon, UserGroupIcon, PaperPlaneIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';
import ConfirmationModal from './ConfirmationModal';

type CsvContact = { nome: string; numero: string };
type SendStatus = 'idle' | 'sending' | 'success' | 'error';

const SendMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState<CsvContact[]>([]);
  const [fileName, setFileName] = useState('');
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem('messageDraft');
    if (savedDraft) {
      setMessage(savedDraft);
    }
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    localStorage.setItem('messageDraft', e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          const parsedContacts = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .slice(1) // Skip header row
            .map(line => {
              const [nome, numero] = line.split(',');
              return { nome: nome?.trim(), numero: numero?.trim() };
            })
            .filter(c => c.nome && c.numero);

          if (parsedContacts.length === 0) {
            throw new Error("CSV inválido ou vazio. Verifique se o formato é 'nome,numero'.");
          }
          setContacts(parsedContacts);
        } catch (error) {
          alert(error instanceof Error ? error.message : "Erro ao processar o arquivo CSV.");
          setContacts([]);
          setFileName('');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || contacts.length === 0) {
      alert('Por favor, escreva uma mensagem e carregue uma lista de contatos.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSend = async () => {
    setIsModalOpen(false);
    setSendStatus('sending');
    setStatusMessage('Enviando mensagens...');
    try {
      await sendBulkMessages(message, contacts);
      setSendStatus('success');
      setStatusMessage('Mensagens adicionadas à fila de envio com sucesso! Acompanhe o status na tela de Relatórios.');
      setMessage('');
      setContacts([]);
      setFileName('');
      localStorage.removeItem('messageDraft');
    } catch (err) {
      setSendStatus('error');
      setStatusMessage('Ocorreu um erro ao enviar as mensagens.');
    } finally {
        setTimeout(() => setSendStatus('idle'), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Enviar Mensagem em Massa</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Message Composer */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">1. Escreva sua Mensagem</h2>
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Digite sua mensagem aqui..."
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white dark:bg-gray-700 dark:text-gray-200"
            required
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{`{{nome}}`}</code> para personalizar a mensagem com o nome do contato.</p>
        </div>

        {/* Right Column: Upload & Send */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">2. Carregue os Contatos</h2>
                <label htmlFor="csv-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <UploadIcon />
                  <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{fileName || 'Clique para carregar arquivo CSV'}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Formato: nome, numero</span>
                  <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                </label>
              {contacts.length > 0 && (
                <div className="flex items-center text-green-600">
                    <UserGroupIcon />
                    <p className="ml-2 font-medium">{contacts.length} contatos carregados.</p>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">3. Enviar</h2>
              <button type="submit" disabled={sendStatus === 'sending' || contacts.length === 0 || !message} className="w-full flex justify-center items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                <PaperPlaneIcon />
                <span className="ml-2">{sendStatus === 'sending' ? 'Enviando...' : 'Enviar para a Fila'}</span>
              </button>
              {sendStatus !== 'idle' && (
                <div className={`mt-4 p-3 rounded-md flex items-center text-sm ${
                    sendStatus === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 
                    sendStatus === 'error' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                }`}>
                    {sendStatus === 'success' && <CheckCircleIcon />}
                    {sendStatus === 'error' && <XCircleIcon />}
                    <span className="ml-2">{statusMessage}</span>
                </div>
              )}
            </div>
        </div>
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSend}
        contactsCount={contacts.length}
        message={message}
      />
    </div>
  );
};

export default SendMessage;
