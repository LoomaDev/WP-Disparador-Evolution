
import type { Contact, ReportStats, AppSettings } from '../types';
import { ContactStatus } from '../types';

let mockContacts: Contact[] = [
  { id: 1, nome: 'João Silva', numero: '5511987654321', status: ContactStatus.Sent, data_envio: '2023-10-26 10:00:00' },
  { id: 2, nome: 'Maria Oliveira', numero: '5521912345678', status: ContactStatus.Sent, data_envio: '2023-10-26 10:01:00' },
  { id: 3, nome: 'Carlos Pereira', numero: '5531988887777', status: ContactStatus.Error, data_envio: '2023-10-26 10:02:00' },
  { id: 4, nome: 'Ana Costa', numero: '5541999998888', status: ContactStatus.Pending, data_envio: new Date().toISOString() },
];

let mockSettings: AppSettings = {
  apiUrl: 'https://api.evolution.com/v1',
  apiKey: 'supersecretapikey',
  defaultMessage: 'Olá {{nome}}, esta é uma mensagem de teste!',
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

export const getSettings = async (): Promise<AppSettings> => {
  return artificialDelay({ ...mockSettings });
};

export const updateSettings = async (newSettings: AppSettings): Promise<AppSettings> => {
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
