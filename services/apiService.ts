
import type { Contact, ReportStats, AppSettings, EvolutionInstance, CreateInstanceRequest, EvolutionSettings } from '../types';
import { ContactStatus } from '../types';

let mockContacts: Contact[] = [
  { id: 1, nome: 'João Silva', numero: '5511987654321', status: ContactStatus.Sent, data_envio: '2023-10-26 10:00:00' },
  { id: 2, nome: 'Maria Oliveira', numero: '5521912345678', status: ContactStatus.Sent, data_envio: '2023-10-26 10:01:00' },
  { id: 3, nome: 'Carlos Pereira', numero: '5531988887777', status: ContactStatus.Error, data_envio: '2023-10-26 10:02:00' },
  { id: 4, nome: 'Ana Costa', numero: '5541999998888', status: ContactStatus.Pending, data_envio: new Date().toISOString() },
];

let mockSettings: EvolutionSettings = {
  apiUrl: 'https://api.evolution.com/v1',
  apiKey: '',
  globalApiKey: '',
  defaultMessage: 'Olá {{nome}}, esta é uma mensagem de teste!',
  instances: [],
  selectedInstance: undefined,
};

const artificialDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 500 + Math.random() * 500));
}

export const getContactsAndStats = async (): Promise<{ contacts: Contact[]; stats: ReportStats }> => {
  const stats: ReportStats = {
    sent: mockContacts.filter(c => c.status === ContactStatus.Sent).length,
    pending: mockContacts.filter(c => c.status === ContactStatus.Pending).length,
    error: mockContacts.filter(c => c.status === ContactStatus.Error).length,
    total: mockContacts.length,
  };
  return artificialDelay({ contacts: [...mockContacts].sort((a,b) => b.id - a.id), stats });
};

export const getSettings = async (): Promise<EvolutionSettings> => {
  return artificialDelay({ ...mockSettings });
};

export const updateSettings = async (newSettings: EvolutionSettings): Promise<EvolutionSettings> => {
  mockSettings = { ...newSettings };
  return artificialDelay({ ...mockSettings });
};

export const testApiConnection = async (settings: AppSettings): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (settings.apiKey.length > 5 && settings.apiUrl.startsWith('http')) {
        return { success: true, message: 'Conexão bem-sucedida!' };
    }
    return { success: false, message: 'Falha na conexão. Verifique a URL e a Chave API.' };
}

export const sendBulkMessages = async (message: string, contacts: { nome: string; numero: string }[]): Promise<{ success: boolean }> => {
  const newContacts: Contact[] = contacts.map((c, index) => ({
    id: mockContacts.length + index + 1,
    nome: c.nome,
    numero: c.numero,
    status: ContactStatus.Pending,
    data_envio: new Date().toISOString(),
  }));

  mockContacts = [...mockContacts, ...newContacts];

  // Simulate processing the queue
  newContacts.forEach(contact => {
    setTimeout(() => {
      const contactIndex = mockContacts.findIndex(c => c.id === contact.id);
      if (contactIndex !== -1) {
        // Randomly succeed or fail
        const newStatus = Math.random() > 0.2 ? ContactStatus.Sent : ContactStatus.Error;
        mockContacts[contactIndex].status = newStatus;
      }
    }, 2000 + Math.random() * 3000);
  });

  return artificialDelay({ success: true });
};

// Limpar contatos dos relatórios
export const clearAllContacts = async (): Promise<{ success: boolean; message: string }> => {
  mockContacts = [];
  return artificialDelay({ success: true, message: 'Todos os contatos foram removidos com sucesso!' });
};

// Evolution API Services
export const createEvolutionInstance = async (instanceData: CreateInstanceRequest): Promise<EvolutionInstance> => {
  // Simular resposta real da Evolution API
  const hash = `api_key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newInstance: EvolutionInstance = {
    instanceName: instanceData.instanceName,
    instanceId: `instance_${Date.now()}`,
    status: 'created',
    integration: instanceData.integration || 'WHATSAPP-BAILEYS',
    createdAt: new Date().toISOString(),
    hash: hash,
    qrcode: instanceData.qrcode ? {
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAOXUlEQVR4nO2dz0sTwwwHJxcJ',
      code: Math.random().toString(36).substr(2, 15)
    } : undefined
  };

  mockSettings.instances.push(newInstance);
  
  // Se QR code foi solicitado, configurar auto-connect simulado
  if (instanceData.qrcode) {
    setTimeout(() => {
      const instance = mockSettings.instances.find(i => i.instanceName === instanceData.instanceName);
      if (instance) {
        instance.status = Math.random() > 0.3 ? 'connected' : 'disconnected';
      }
    }, 5000); // Simular tempo de escaneamento do QR
  }

  return artificialDelay(newInstance);
};

export const fetchEvolutionInstances = async (): Promise<EvolutionInstance[]> => {
  return artificialDelay([...mockSettings.instances]);
};

export const connectEvolutionInstance = async (instanceName: string): Promise<{ success: boolean; qrcode?: { base64: string; code: string }; message: string }> => {
  const instance = mockSettings.instances.find(i => i.instanceName === instanceName);
  if (!instance) {
    return artificialDelay({ success: false, message: 'Instância não encontrada!' });
  }

  if (instance.status === 'connected') {
    return artificialDelay({ success: false, message: 'Instância já está conectada!' });
  }

  instance.status = 'connecting';
  const newQrCode = {
    base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAOXUlEQVR4nO2dz0sTwwwHJxcJ',
    code: Math.random().toString(36).substr(2, 15)
  };
  
  instance.qrcode = newQrCode;

  // Simular conexão após alguns segundos
  setTimeout(() => {
    if (instance.status === 'connecting') {
      instance.status = Math.random() > 0.3 ? 'connected' : 'disconnected';
    }
  }, 5000);

  return artificialDelay({ 
    success: true, 
    qrcode: newQrCode,
    message: 'QR Code gerado! Escaneie com o WhatsApp para conectar.' 
  });
};

export const getInstanceConnectionStatus = async (instanceName: string): Promise<{ status: string; message: string }> => {
  const instance = mockSettings.instances.find(i => i.instanceName === instanceName);
  if (!instance) {
    return artificialDelay({ status: 'not_found', message: 'Instância não encontrada!' });
  }

  return artificialDelay({ 
    status: instance.status, 
    message: instance.status === 'connected' ? 'Conectado' : 'Desconectado' 
  });
};

export const deleteEvolutionInstance = async (instanceName: string): Promise<{ success: boolean; message: string }> => {
  const instanceIndex = mockSettings.instances.findIndex(i => i.instanceName === instanceName);
  if (instanceIndex === -1) {
    return artificialDelay({ success: false, message: 'Instância não encontrada!' });
  }

  mockSettings.instances.splice(instanceIndex, 1);
  return artificialDelay({ success: true, message: 'Instância removida com sucesso!' });
};
