/**
 * api.js — Tous les appels vers le backend Flask
 * L'URL de base est définie dans .env : VITE_API_URL=https://ton-backend.onrender.com
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('dmg_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || data.error || 'Erreur serveur')
  return data
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  /** Inscription */
  register: (name, email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  /** Connexion email/mot de passe */
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /** Connexion Gmail (Google OAuth) */
  googleLogin: (token) =>
    request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  /** Demander un email de réinitialisation */
  requestReset: (email) =>
    request('/api/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /** Vérifier le code reçu par email */
  verifyResetCode: (email, code) =>
    request('/api/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  /** Réinitialiser le mot de passe */
  resetPassword: (email, code, new_password) =>
    request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, new_password }),
    }),

  /** Profil de l'utilisateur connecté */
  me: () => request('/api/auth/me'),
}

// ── MEDIA ────────────────────────────────────────────────────────────────────

export const mediaAPI = {
  /** Récupérer tous les médias de l'utilisateur */
  list: () => request('/api/media/'),

  /** Uploader un fichier */
  upload: (file, category = 'Général') => {
    const form = new FormData()
    form.append('file', file)
    form.append('category', category)
    return request('/api/media/upload', { method: 'POST', body: form })
  },

  /** Supprimer un fichier */
  delete: (id) => request(`/api/media/${id}`, { method: 'DELETE' }),

  /** Renommer un fichier */
  rename: (id, name) =>
    request(`/api/media/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),

  /** Télécharger (retourne l'URL Cloudinary directement) */
  getDownloadUrl: (id) => request(`/api/media/${id}/download`),
}
