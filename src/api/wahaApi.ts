import axios from 'axios';

// Use relative URL so Vite (dev) and Vercel (production) proxies handle /api
const DEFAULT_BASE_URL = '';
const DEFAULT_API_KEY = 'f07d255624d14f74a4b5239c718122a4';

export interface RelayXConfig {
  baseUrl: string;
  apiKey: string;
}

export function getConfig(): RelayXConfig {
  const saved = localStorage.getItem('relayx_config');
  if (saved) return JSON.parse(saved);
  return { baseUrl: DEFAULT_BASE_URL, apiKey: DEFAULT_API_KEY };
}

export function saveConfig(config: RelayXConfig) {
  localStorage.setItem('relayx_config', JSON.stringify(config));
}

export function getApi() {
  const config = getConfig();
  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      'X-Api-Key': config.apiKey,
      'Content-Type': 'application/json',
    },
  });
}

// --- Sessions ---

export interface Session {
  name: string;
  status: string;
  config?: Record<string, unknown>;
}

export async function getSessions(): Promise<Session[]> {
  const { data } = await getApi().get('/api/sessions', { params: { all: true } });
  return data;
}

export async function getSession(name: string): Promise<Session> {
  const { data } = await getApi().get(`/api/sessions/${name}`);
  return data;
}

export async function createSession(name: string): Promise<void> {
  try {
    await getApi().post('/api/sessions', { name });
  } catch (err: unknown) {
    // 422 means session already exists — that's fine, treat as success
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      return;
    }
    throw err;
  }
}

export async function deleteSession(name: string): Promise<void> {
  await getApi().delete(`/api/sessions/${name}`);
}

export async function startSession(name: string): Promise<void> {
  await getApi().post(`/api/sessions/${name}/start`);
}

export async function stopSession(name: string): Promise<void> {
  await getApi().post(`/api/sessions/${name}/stop`);
}

export async function restartSession(name: string): Promise<void> {
  await getApi().post(`/api/sessions/${name}/restart`);
}

export async function logoutSession(name: string): Promise<void> {
  await getApi().post(`/api/sessions/${name}/logout`);
}

export async function getQrCode(session: string): Promise<string> {
  const config = getConfig();
  const response = await fetch(`${config.baseUrl}/api/${session}/auth/qr`, {
    headers: { 'X-Api-Key': config.apiKey },
  });
  if (!response.ok) throw new Error('Failed to get QR code');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function getScreenshot(session: string): Promise<string> {
  const config = getConfig();
  const response = await fetch(`${config.baseUrl}/api/sessions/${session}/screenshot`, {
    headers: { 'X-Api-Key': config.apiKey },
  });
  if (!response.ok) throw new Error('Failed to get screenshot');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export function revokeBlobUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// --- Chats ---

export interface Chat {
  id: string;
  name?: string;
  timestamp?: number;
  unreadCount?: number;
  lastMessage?: {
    body?: string;
    timestamp?: number;
    fromMe?: boolean;
  };
  isGroup?: boolean;
  isReadOnly?: boolean;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  body?: string;
  fromMe?: boolean;
  timestamp?: number;
  author?: string;
  type?: string;
  [key: string]: unknown;
}

export async function getChats(session: string, limit = 50, offset = 0): Promise<Chat[]> {
  const { data } = await getApi().get(`/api/${session}/chats/overview`, {
    params: { limit, offset },
  });
  return data;
}

export async function getMessages(
  session: string,
  chatId: string,
  limit = 100,
): Promise<Message[]> {
  const { data } = await getApi().get(`/api/${session}/chats/${chatId}/messages`, {
    params: { limit },
  });
  return data;
}

export async function sendText(
  session: string,
  chatId: string,
  text: string,
): Promise<void> {
  await getApi().post('/api/sendText', {
    session,
    chatId,
    text,
  });
}

export async function sendImage(
  session: string,
  chatId: string,
  url: string,
  caption?: string,
): Promise<void> {
  await getApi().post('/api/sendImage', {
    session,
    chatId,
    file: { url },
    caption,
  });
}

// --- Status ---

export async function checkHealth(): Promise<boolean> {
  try {
    const config = getConfig();
    const response = await fetch(`${config.baseUrl}/api/sessions?all=true`, {
      headers: { 'X-Api-Key': config.apiKey },
    });
    return response.ok;
  } catch {
    return false;
  }
}
