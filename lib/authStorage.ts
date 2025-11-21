export type StoredUser = {
  email: string;
  rol: string; 
};

const KEYS = {
  token: "accessToken",
  user: "usuario",
} as const;

export function setSession(token: string, usuario: StoredUser) {
  localStorage.setItem(KEYS.token, token);
  localStorage.setItem(KEYS.user, JSON.stringify(usuario));
}

export function getToken(): string | null {
  return localStorage.getItem(KEYS.token);
}

export function getUsuario(): StoredUser | null {
  const raw = localStorage.getItem(KEYS.user);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEYS.token);
  localStorage.removeItem(KEYS.user);
}
