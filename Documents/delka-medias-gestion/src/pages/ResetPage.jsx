import { useState } from 'react'
import { authAPI } from '../utils/api'

export default function ResetPage({ onGoLogin }) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('request') // request | sent | reset
  const [code, setCode] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequest = async () => {
    setError('')
    if (!email || !email.includes('@')) { setError('Email invalide.'); return }
    setLoading(true)
    try {
      await authAPI.requestReset(email)
      setStep('sent')
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setError('')
    if (!code || code.length !== 6) { setError('Entrez le code à 6 chiffres reçu par email.'); return }
    setLoading(true)
    try {
      await authAPI.verifyResetCode(email, code)
      setStep('reset')
    } catch (err) {
      setError(err.message || 'Code invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setError('')
    if (newPwd.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    setLoading(true)
    try {
      await authAPI.resetPassword(email, code, newPwd)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation.')
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

        {!success ? (
          <>
            <div className="auth-title">
              {step === 'request' ? 'Réinitialiser 🔑' : step === 'sent' ? 'Vérifier le code 📧' : 'Nouveau mot de passe'}
            </div>
            <div className="auth-subtitle">
              {step === 'request'
                ? 'Entrez votre email pour recevoir un code'
                : step === 'sent'
                ? `Un code a été envoyé à ${email}`
                : 'Choisissez un nouveau mot de passe sécurisé'}
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {step === 'request' && (
              <>
                <div className="field-group">
                  <label className="field-label">Adresse email</label>
                  <input className="field-input" type="email" placeholder="vous@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRequest()} />
                </div>
                <button className="btn-primary" onClick={handleRequest} disabled={loading}>
                  {loading ? 'Envoi...' : 'Envoyer le code'}
                </button>
              </>
            )}

            {step === 'sent' && (
              <>
                <div className="alert alert-success">
                  ✅ Code envoyé ! Vérifiez votre boîte mail (et vos spams).
                </div>
                <div className="field-group">
                  <label className="field-label">Code de vérification (6 chiffres)</label>
                  <input className="field-input" type="text" placeholder="123456"
                    maxLength={6} value={code} onChange={e => setCode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()} />
                </div>
                <button className="btn-primary" onClick={handleVerify} disabled={loading}>
                  {loading ? 'Vérification...' : 'Vérifier le code'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <span className="auth-link" onClick={() => { setStep('request'); setError('') }}>
                    ← Renvoyer un code
                  </span>
                </div>
              </>
            )}

            {step === 'reset' && (
              <>
                <div className="field-group">
                  <label className="field-label">Nouveau mot de passe</label>
                  <input className="field-input" type="password" placeholder="Min. 6 caractères"
                    value={newPwd} onChange={e => setNewPwd(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReset()} />
                </div>
                <button className="btn-primary" onClick={handleReset} disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="auth-title">C'est fait ! 🎉</div>
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              ✅ Mot de passe réinitialisé avec succès !
            </div>
            <button className="btn-primary" onClick={onGoLogin}>Se connecter maintenant</button>
          </>
        )}

        <div className="auth-footer" style={{ marginTop: 20 }}>
          <span className="auth-link" onClick={onGoLogin}>← Retour à la connexion</span>
        </div>
      </div>
    </div>
  )
}
