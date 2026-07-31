import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ApprovalsPage } from './pages/ApprovalsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { MissionDetailPage } from './pages/MissionDetailPage'
import { NewMissionPage } from './pages/NewMissionPage'
import { useStore } from './store/Store'

function RequireAuth({ children }: { children: ReactNode }) {
  const { currentUser } = useStore()
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { currentUser } = useStore()

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="missions/new" element={<NewMissionPage />} />
        <Route path="missions/:id" element={<MissionDetailPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
    </Routes>
  )
}
