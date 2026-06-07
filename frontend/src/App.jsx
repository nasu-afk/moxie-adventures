import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

import HomePage from './pages/HomePage'
import TreksPage from './pages/TreksPage'
import TrekDetailPage from './pages/TrekDetailPage'
import CampingPage from './pages/CampingPage'
import StargazingPage from './pages/StargazingPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import GalleryPage from './pages/GalleryPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CareersPage from './pages/CareersPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { AdminLogin, AdminDashboard } from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'

// Pages that use the public layout (Navbar + Footer)
const PUBLIC_ROUTES = [
  { path: '/', element: <HomePage /> },
  { path: '/treks', element: <TreksPage /> },
  { path: '/treks/:slug', element: <TrekDetailPage /> },
  { path: '/camping', element: <CampingPage /> },
  { path: '/stargazing', element: <StargazingPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/events/:slug', element: <EventDetailPage /> },
  { path: '/gallery', element: <GalleryPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/careers', element: <CareersPage /> },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [pathname])
  return null
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <ScrollToTop />
      {isAdmin ? (
        <Routes location={location}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      ) : (
        <PublicLayout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {PUBLIC_ROUTES.map(r => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </PublicLayout>
      )}
    </AuthProvider>
  )
}
