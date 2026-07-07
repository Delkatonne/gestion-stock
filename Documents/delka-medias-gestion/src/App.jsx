import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MediaProvider } from './context/MediaContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPage from './pages/ResetPage'
import DashboardPage from './pages/DashboardPage'

function AppRouter() {
  const { user } = useAuth()
  const [screen, setScreen] = useState('login')

  if (user) {
    return (
      <MediaProvider>
        <DashboardPage />
      </MediaProvider>
    )
  }

  if (screen === 'register') return <RegisterPage onGoLogin={() => setScreen('login')} />
  if (screen === 'reset')    return <ResetPage onGoLogin={() => setScreen('login')} />
  return <LoginPage onGoRegister={() => setScreen('register')} onGoReset={() => setScreen('reset')} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
