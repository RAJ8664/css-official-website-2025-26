import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'
import { NavbarDemo } from './components/NavbarDiwali'
import Events from './pages/Events'
import MoreEvents from './pages/MoreEvents'
import Auth from './pages/Auth'
import OtpVerification from './pages/OtpVerification'
import Dashboard from './pages/Dashboard'
import CompleteProfile from './pages/CompleteProfilePage'
import AuthProvider from './context/AuthContext'
import AuthCallback from './pages/AuthCallback'
import Wings from './pages/Wings'
import Developers from './pages/Developers'

import { useAuth } from './context/AuthContext'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import Footer from './components/Footer'
import Materials from './pages/Materials'

import Leaderboard from './pages/Leaderboard'
import ScrollToTop from './components/ScrolltoTop'

import { initGA, logPageView } from './utils/analytics'
import DiwaliWidget from './components/DiwaliWidget'
import ChatSystem from './pages/ChatSystem'
import EmailMigration from './pages/EmailMigration'
import MigrationCallback from './pages/MigrationCallBack'
import FreshersEvents from './pages/FreshersEvents'
import EventsRegistration from './pages/Esperanza'

const ProtectedRoute = ({
  children,
  requireProfileCompletion = false,
  requireCollegeVerification = false,
}) => {
  const {
    user,
    loading,
    requiresProfileCompletion,
    requiresCollegeVerification,
    isCollegeEmail,
  } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (requireProfileCompletion && requiresProfileCompletion) {
    return <Navigate to="/complete-profile" replace />
  }

  if (requireCollegeVerification && requiresCollegeVerification) {
    const skippedMigration = localStorage.getItem('skippedCollegeMigration')
    const isCollegeUser = isCollegeEmail(user.email)

    if (!isCollegeUser && !skippedMigration) {
      return <Navigate to="/email-migration" replace />
    }

    if (!isCollegeUser && skippedMigration) {
      return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <h1 className="text-2xl text-red-400 mb-4">Access Restricted</h1>
            <p className="text-gray-300 mb-4">
              This feature requires college email verification.
            </p>
            <button
              onClick={() => (window.location.href = '/email-migration')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg"
            >
              Verify College Email
            </button>
          </div>
        </div>
      )
    }
  }

  return children
}

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/esperanza" replace />
  }

  return children
}

const NavbarWrapper = () => {
  const location = useLocation()
  if (location.pathname === '/') {
    return null
  }

  return <NavbarDemo />
}

const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    logPageView(location.pathname + location.search)
  }, [location])

  return null
}

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)]">
      {children}
    </div>
  )
}

const App = () => {
  useEffect(() => {
    initGA()
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <ScrollToTop />

        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)]">
          <NavbarWrapper />

          <div className="relative">
            <Routes>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />

              <Route
                path="/members"
                element={
                  <PageWrapper>
                    <Member />
                  </PageWrapper>
                }
              />

              <Route
                path="/events"
                element={
                  <PageWrapper>
                    <Events />
                  </PageWrapper>
                }
              />

              <Route
                path="/wings"
                element={
                  <PageWrapper>
                    <Wings />
                  </PageWrapper>
                }
              />

              <Route
                path="/developers"
                element={
                  <PageWrapper>
                    <Developers />
                  </PageWrapper>
                }
              />

              {/* <Route path="/events/:slug" element={
                <PageWrapper>
                  <MoreEvents />
                </PageWrapper>
              } /> */}

              <Route
                path="/events/:eventSlug"
                element={
                  <ProtectedRoute requireProfileCompletion={true}>
                    <PageWrapper>
                      <FreshersEvents />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/esperanza"
                element={
                  <PageWrapper>
                    <EventsRegistration />
                  </PageWrapper>
                }
              />

              <Route
                path="/materials"
                element={
                  <PageWrapper>
                    <Materials />
                  </PageWrapper>
                }
              />

              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <PageWrapper>
                      <Auth />
                    </PageWrapper>
                  </GuestRoute>
                }
              />

              <Route
                path="/auth/callback"
                element={
                  <PageWrapper>
                    <AuthCallback />
                  </PageWrapper>
                }
              />

              <Route
                path="/otp-verification"
                element={
                  <PageWrapper>
                    <OtpVerification />
                  </PageWrapper>
                }
              />

              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <CompleteProfile />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireProfileCompletion={true}>
                    <PageWrapper>
                      <Dashboard />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute requireProfileCompletion={true}>
                    <PageWrapper>
                      <Leaderboard />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireProfileCompletion={true}>
                    <AdminRoute>
                      <PageWrapper>
                        <AdminDashboard />
                      </PageWrapper>
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <PageWrapper>
                    <Navigate to="/" replace />
                  </PageWrapper>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute
                    requireProfileCompletion={true}
                    requireCollegeVerification={true}
                  >
                    <PageWrapper>
                      <ChatSystem />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/email-migration"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <EmailMigration />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/migration-callback"
                element={
                  <PageWrapper>
                    <MigrationCallback />
                  </PageWrapper>
                }
              />
            </Routes>
          </div>
          <DiwaliWidget />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
