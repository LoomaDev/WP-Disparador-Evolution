
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

export type View = 'dashboard' | 'send' | 'settings';
