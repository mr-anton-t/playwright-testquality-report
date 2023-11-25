export type ConfigTQ = {
  email: string;
  password: string;
  clientName: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  passTQid: number;
  failTQid: number;
  runIdTQ: number;
}

export interface CredsTQ {
  email?: string;
  password?: string;
  clientName?: string;
}