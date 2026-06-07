import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Treks', to: '/treks' },
  { label: 'Camping', to: '/camping' },
  { label: 'Stargazing', to: '/stargazing' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logoutUser } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-stone-950/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 relative">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M16 3L3 26H29L16 3Z" stroke="#c87820" strokeWidth="1.5" fill="none"/>
                <path d="M10 26L16 14L22 26" stroke="#c87820" strokeWidth="1" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <span className="font-display text-xl font-500 text-cream tracking-wide">Moxie</span>
              <span className="font-display text-xl font-300 text-brand-400 tracking-wide ml-1.5">Adventures</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-xs tracking-widest uppercase font-sans transition-colors duration-200 ${
                    isActive ? 'text-brand-400' : 'text-cream/60 hover:text-cream'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + User */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-cream/60 text-sm">{user.name}</span>
                <button onClick={logoutUser} className="text-cream/40 hover:text-cream text-xs uppercase tracking-wider transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-cream/60 hover:text-cream text-xs uppercase tracking-wider transition-colors">
                Login
              </Link>
            )}
            <Link to="/treks" className="btn-primary text-xs py-2.5 px-5">
              Explore Treks
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-cream"
            aria-label="Menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block w-6 h-px bg-current"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-px bg-current"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block w-6 h-px bg-current"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-stone-950/98 backdrop-blur-xl pt-24 px-6 flex flex-col lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block py-4 border-b border-white/5 font-display text-3xl font-300 transition-colors ${
                        isActive ? 'text-brand-400' : 'text-cream/80 hover:text-cream'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-4">
              <Link to="/treks" className="btn-primary justify-center">Explore Treks</Link>
              <Link to="/events" className="btn-outline justify-center">Upcoming Events</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
