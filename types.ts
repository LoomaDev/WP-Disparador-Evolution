
export enum ContactStatus {
  Pending = 'pendente',
  Sent = 'enviado',
  Error = 'erro',
}

export interface Contact {
  id: number;
  nome: string;
  numero: string;
  status: ContactStatus;
  data_envio: string;
}

export interface ReportStats {
  sent: number;
  pending: number;
  error: number;
  total: number;
}

export interface AppSettings {
  apiUrl: string;
  apiKey: string;
  defaultMessage: string;
}

// Evolution API Types
export interface EvolutionInstance {
  instanceName: string;
  instanceId?: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'created';
  qrcode?: {
    base64: string;
    code: string;
  };
  hash?: string; // API key retornada pela API
  integration: 'WHATSAPP-BAILEYS' | 'WHATSAPP-BUSINESS';
  createdAt: string;
}

export interface CreateInstanceRequest {
  instanceName: string;
  qrcode?: boolean;
  integration?: 'WHATSAPP-BAILEYS' | 'WHATSAPP-BUSINESS';
}

export interface EvolutionSettings extends AppSettings {
  globalApiKey: string;
  instances: EvolutionInstance[];
  selectedInstance?: string;
}

export type View = 'dashboard' | 'send' | 'settings';
