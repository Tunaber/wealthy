const TOKEN_KEY = 'welphy_token';
const USER_KEY = 'welphy_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(user, token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body) headers['Content-Type'] = 'application/json';

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Не удалось выполнить запрос');
  }
  return data;
}

export async function validateToken(token) {
  if (!token) return null;
  try {
    const { user } = await api('/api/auth/me');
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export async function login(email, password) {
  const data = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setSession(data.user, data.token);
  return data.user;
}

export async function register(name, email, password) {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setSession(data.user, data.token);
  return data.user;
}

export async function logout() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch {
    // Игнорируем сетевые ошибки при выходе
  }
  clearSession();
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
  }
}