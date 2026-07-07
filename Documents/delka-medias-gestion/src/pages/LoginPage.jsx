import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'

export default function LoginPage({ onGoRegister, onGoReset }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    try {
      const data = await authAPI.login(email, password)
      login(data.token, data.user)
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="brand-logo">
          <div className="brand-icon">📁</div>
          <div>
            <div className="brand-name">Delka Médias</div>
            <div className="brand-sub">Gestion</div>
          </div>
        </div>

        <div className="auth-title">Bon retour 👋</div>
        <div className="auth-subtitle">Connectez-vous pour accéder à vos médias</div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="divider">connexion avec votre email</div>

        <div className="field-group">
          <label className="field-label">Adresse email</label>
          <input
            className="field-input" type="email" placeholder="vous@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="field-group">
          <label className="field-label">Mot de passe</label>
          <input
            className="field-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
          <span className="auth-link" onClick={onGoReset}>Mot de passe oublié ?</span>
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="auth-footer">
          Pas encore de compte ?{' '}
          <span className="auth-link" onClick={onGoRegister}>Créer un compte</span>
        </div>
      </div>
    </div>
  )
}
