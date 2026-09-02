import { useCallback, useEffect, useState } from 'react'
import type { Page, NavigateFn, Issue } from './types'
import { api } from './services/api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ProblemDetails from './pages/ProblemDetails'
import ReportProblem from './pages/ReportProblem'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import FAQ from './pages/FAQ'

function Shell() {
  const [page, setPage] = useState<Page>('home')
  const [selectedIssueId, setIssueId] = useState<string | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const refreshIssues = useCallback(async () => {
    try {
      const next = await api.getIssues()
      setIssues(next)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load issues')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshIssues()
  }, [refreshIssues])

  const navigate: NavigateFn = (nextPage, id) => {
    setPage(nextPage)
    if (id) setIssueId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showNav = page !== 'login' && page !== 'signup'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showNav && <Navbar page={page} navigate={navigate} />}

      <main style={{ flex: 1 }}>
        {error && page === 'home' && (
          <div style={{ maxWidth: 1280, margin: '16px auto 0', padding: '0 24px' }}>
            <div className="card" style={{ padding: '12px 16px', color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }}>
              {error}. Start the backend with `pnpm dev` if it is not running.
            </div>
          </div>
        )}
        {page === 'home' && <Home navigate={navigate} issues={issues} loading={loading} />}
        {page === 'explore' && <Explore navigate={navigate} issues={issues} />}
        {page === 'issue-detail' && (
          <ProblemDetails navigate={navigate} issues={issues} issueId={selectedIssueId} onChange={refreshIssues} />
        )}
        {page === 'report' && <ReportProblem navigate={navigate} onSubmitted={refreshIssues} />}
        {page === 'login' && <Login navigate={navigate} />}
        {page === 'signup' && <Register navigate={navigate} />}
        {page === 'profile' && <Profile navigate={navigate} issues={issues} onChange={refreshIssues} />}
        {page === 'admin' && <AdminDashboard navigate={navigate} issues={issues} onChange={refreshIssues} />}
        {page === 'faq' && <FAQ navigate={navigate} />}
      </main>

      {showNav && <Footer navigate={navigate} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
