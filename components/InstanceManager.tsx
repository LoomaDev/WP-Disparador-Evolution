import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { 
  createEvolutionInstance, 
  fetchEvolutionInstances, 
  connectEvolutionInstance, 
  deleteEvolutionInstance,
  getInstanceConnectionStatus 
} from '../services/apiService';
import type { EvolutionInstance, CreateInstanceRequest } from '../types';

const InstanceManager: React.FC = () => {
  const [instances, setInstances] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<{ base64: string; code: string } | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
  // Form states
  const [instanceName, setInstanceName] = useState('');
  const [integration, setIntegration] = useState<'WHATSAPP-BAILEYS' | 'WHATSAPP-BUSINESS'>('WHATSAPP-BAILEYS');
  const [creating, setCreating] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const fetchInstances = async () => {
    setLoading(true);
    try {
      const instanceList = await fetchEvolutionInstances();
      setInstances(instanceList);
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const handleCreateInstance = async () => {
    if (!instanceName.trim()) return;
    
    setCreating(true);
    try {
      const newInstanceData: CreateInstanceRequest = {
        instanceName: instanceName.trim(),
        qrcode: true,
        integration
      };
      
      await createEvolutionInstance(newInstanceData);
      await fetchInstances();
      setInstanceName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleConnectInstance = async (name: string) => {
    setConnecting(true);
    try {
      const result = await connectEvolutionInstance(name);
      if (result.success && result.qrcode) {
        setQrCodeData(result.qrcode);
        setShowQrModal(true);
      }
      await fetchInstances();
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDeleteInstance = async () => {
    try {
      await deleteEvolutionInstance(selectedInstance);
      await fetchInstances();
      setShowDeleteModal(false);
      setSelectedInstance('');
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      case 'disconnected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando';
      case 'disconnected': return 'Desconectado';
      case 'created': return 'Criado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Instâncias WhatsApp</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Instância
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Carregando instâncias...</p>
      ) : instances.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhuma instância criada</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando uma nova instância WhatsApp.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {instances.map((instance) => (
            <div key={instance.instanceName} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{instance.instanceName}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Integração: {instance.integration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Criado em: {new Date(instance.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instance.status)}`}>
                    {getStatusText(instance.status)}
                  </span>
                  <div className="flex space-x-2">
                    {instance.status !== 'connected' && (
                      <button
                        onClick={() => handleConnectInstance(instance.instanceName)}
                        disabled={connecting}
                        className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded transition-all"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {connecting ? 'Conectando...' : 'Conectar'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedInstance(instance.instanceName);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-all"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para criar instância */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Nova Instância WhatsApp</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Instância
                </label>
                <input
                  type="text"
                  id="instanceName"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  placeholder="Ex: empresa-principal"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="integration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Integração
                </label>
                <select
                  id="integration"
                  value={integration}
                  onChange={(e) => setIntegration(e.target.value as 'WHATSAPP-BAILEYS' | 'WHATSAPP-BUSINESS')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WHATSAPP-BAILEYS">WhatsApp Baileys</option>
                  <option value="WHATSAPP-BUSINESS">WhatsApp Business</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setInstanceName('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateInstance}
                disabled={creating || !instanceName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all"
              >
                {creating ? 'Criando...' : 'Criar Instância'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de QR Code */}
      {showQrModal && qrCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Escaneie o QR Code</h3>
            <div className="mb-4">
              <img src={qrCodeData.base64} alt="QR Code" className="mx-auto max-w-full h-auto border rounded-lg" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Abra o WhatsApp no seu celular e escaneie este código para conectar a instância.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Código: {qrCodeData.code}
            </p>
            <button
              onClick={() => {
                setShowQrModal(false);
                setQrCodeData(null);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação para excluir */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Excluir Instância"
          message={`Tem certeza que deseja excluir a instância "${selectedInstance}"? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          onConfirm={handleDeleteInstance}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedInstance('');
          }}
          type="danger"
        />
      )}
    </div>
  );
};

export default InstanceManager;