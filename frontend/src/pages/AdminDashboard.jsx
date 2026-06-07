import { useState, useEffect } from 'react'
import { Link, useNavigate, Routes, Route, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

// ============================================================
// Admin Login
// ============================================================
export function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [state, setState] = useState({ loading: false, error: '' })
  const { admin, loginAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (admin) navigate('/admin') }, [admin])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, error: '' })
    try {
      const res = await api.post('/auth/admin/login', form)
      if (res.success) { loginAdmin(res); navigate('/admin') }
      else setState({ loading: false, error: res.message })
    } catch { setState({ loading: false, error: 'Login failed' }) }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-2xl text-cream mb-1">Moxie Adventures</div>
          <div className="text-cream/40 text-sm">Admin Panel</div>
        </div>
        <div className="bg-stone-900 border border-white/10 p-8">
          <form onSubmit={submit} className="space-y-4">
            <input type="email" placeholder="Admin Email" required value={form.email} onChange={set('email')} className="input-field" />
            <input type="password" placeholder="Password" required value={form.password} onChange={set('password')} className="input-field" />
            {state.error && <p className="text-red-400 text-xs">{state.error}</p>}
            <button type="submit" disabled={state.loading} className="btn-primary w-full justify-center">
              {state.loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center mt-6 text-xs text-cream/30">Default: admin@moxieadventures.com / Admin@123</p>
        </div>
        <div className="text-center mt-4"><Link to="/" className="text-cream/30 text-xs hover:text-cream">← Back to website</Link></div>
      </div>
    </div>
  )
}

// ============================================================
// Admin Layout
// ============================================================
const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/admin/treks', label: 'Treks', icon: '⛰' },
  { to: '/admin/events', label: 'Events', icon: '📅' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼' },
  { to: '/admin/reviews', label: 'Reviews', icon: '★' },
  { to: '/admin/applications', label: 'Applications', icon: '👤' },
  { to: '/admin/contacts', label: 'Messages', icon: '✉' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
]

function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAuth()
  const navigate = useNavigate()

  const logout = () => { logoutAdmin(); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-stone-950 border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/5">
          <div className="font-display text-lg text-cream">Moxie Admin</div>
          <div className="text-cream/30 text-xs mt-0.5">{admin?.name || 'Administrator'}</div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-cream/50 hover:text-cream hover:bg-white/5'}`}>
              <span>{n.icon}</span> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="w-full text-left text-cream/30 hover:text-cream text-xs transition-colors">Sign Out</button>
        </div>
      </aside>
      {/* Content */}
      <main className="flex-1 ml-56 p-8 overflow-auto">{children}</main>
    </div>
  )
}

// ============================================================
// Dashboard Home
// ============================================================
function Dashboard() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/admin/dashboard', true).then(res => setData(res.data)) }, [])

  const CARDS = data ? [
    { label: 'Total Bookings', value: data.total_bookings, icon: '📋', color: 'brand' },
    { label: 'Revenue', value: '₹' + Number(data.revenue || 0).toLocaleString('en-IN'), icon: '₹', color: 'forest' },
    { label: 'Upcoming Events', value: data.upcoming_events, icon: '📅', color: 'purple' },
    { label: 'Subscribers', value: data.subscribers, icon: '📧', color: 'blue' },
  ] : []

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {CARDS.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-stone-900 border border-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-cream/40 text-xs uppercase tracking-wider">{c.label}</span>
              <span className="text-xl">{c.icon}</span>
            </div>
            <div className="font-display text-3xl text-cream">{c.value ?? '—'}</div>
          </motion.div>
        ))}
      </div>
      {data?.recent_bookings?.length > 0 && (
        <div className="bg-stone-900 border border-white/5 p-5">
          <h3 className="text-cream font-sans font-500 mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-cream/30 text-xs uppercase tracking-wider">
                  <th className="text-left pb-3">Ref</th><th className="text-left pb-3">Name</th>
                  <th className="text-left pb-3">Trek</th><th className="text-left pb-3">Date</th>
                  <th className="text-left pb-3">Amount</th><th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {data.recent_bookings.map(b => (
                  <tr key={b.id} className="border-t border-white/5 text-cream/70">
                    <td className="py-2 text-brand-400 text-xs">{b.booking_ref}</td>
                    <td className="py-2">{b.name}</td>
                    <td className="py-2 text-cream/50">{b.trek_name}</td>
                    <td className="py-2 text-cream/50">{new Date(b.trek_date).toLocaleDateString('en-IN')}</td>
                    <td className="py-2">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 ${b.status === 'confirmed' ? 'bg-forest-500/20 text-forest-300' : b.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-brand-500/20 text-brand-300'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Bookings Manager
// ============================================================
function BookingsManager() {
  const [bookings, setBookings] = useState([])
  useEffect(() => { api.get('/admin/bookings', true).then(res => setBookings(res.data || [])) }, [])

  const updateStatus = async (id, status) => {
    await api.put(`/admin/bookings/${id}`, { status }, true)
    setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Bookings</h1>
      <div className="bg-stone-900 border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-cream/30 text-xs uppercase tracking-wider">
              {['Ref', 'Name', 'Email', 'Trek', 'Date', 'Pax', 'Amount', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b border-white/5 text-cream/70 hover:bg-white/2">
                <td className="px-4 py-3 text-brand-400 text-xs">{b.booking_ref}</td>
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3 text-cream/40 text-xs">{b.email}</td>
                <td className="px-4 py-3 text-cream/60">{b.trek_name}</td>
                <td className="px-4 py-3 text-cream/50 text-xs">{new Date(b.trek_date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-center">{b.participants}</td>
                <td className="px-4 py-3">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 ${b.status === 'confirmed' ? 'bg-forest-500/20 text-forest-300' : b.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-brand-500/20 text-brand-300'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                    className="bg-stone-800 border border-white/10 text-cream text-xs px-2 py-1">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirm</option>
                    <option value="cancelled">Cancel</option>
                    <option value="completed">Complete</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center text-cream/30 py-12 text-sm">No bookings yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Reviews Manager
// ============================================================
function ReviewsManager() {
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    // Get all reviews (including unapproved) via admin endpoint
    api.get('/reviews', true).then(res => setReviews(res.data || []))
  }, [])

  const update = async (id, is_approved, is_featured) => {
    await api.put(`/admin/reviews/${id}`, { is_approved, is_featured }, true)
    setReviews(rs => rs.map(r => r.id === id ? { ...r, is_approved: is_approved ? 1 : 0, is_featured: is_featured ? 1 : 0 } : r))
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Reviews</h1>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-stone-900 border border-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-sans text-cream">{r.reviewer_name}</span>
                  <div className="flex gap-0.5">{Array.from({length: r.rating}).map((_, i) => <span key={i} className="text-brand-400 text-xs">★</span>)}</div>
                  {!r.is_approved && <span className="text-xs bg-red-500/15 text-red-300 px-2 py-0.5">Pending</span>}
                  {r.is_featured ? <span className="text-xs bg-brand-500/15 text-brand-300 px-2 py-0.5">Featured</span> : null}
                </div>
                {r.title && <div className="text-cream/60 text-sm mb-1 font-500">{r.title}</div>}
                <p className="text-cream/50 text-sm">{r.body}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => update(r.id, !r.is_approved, r.is_featured)} className={`text-xs px-3 py-1 border transition-colors ${r.is_approved ? 'border-red-500/30 text-red-300 hover:bg-red-500/10' : 'border-forest-500/30 text-forest-300 hover:bg-forest-500/10'}`}>
                  {r.is_approved ? 'Unapprove' : 'Approve'}
                </button>
                <button onClick={() => update(r.id, r.is_approved, !r.is_featured)} className={`text-xs px-3 py-1 border transition-colors ${r.is_featured ? 'border-white/20 text-cream/40' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10'}`}>
                  {r.is_featured ? 'Unfeature' : 'Feature'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-center text-cream/30 py-12">No reviews yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Contacts
// ============================================================
function ContactsManager() {
  const [msgs, setMsgs] = useState([])
  useEffect(() => { api.get('/admin/contacts', true).then(res => setMsgs(res.data || [])) }, [])

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Contact Messages</h1>
      <div className="space-y-3">
        {msgs.map(m => (
          <div key={m.id} className={`bg-stone-900 border p-5 ${!m.is_read ? 'border-brand-500/30' : 'border-white/5'}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="font-sans text-cream">{m.name}</span>
                <span className="text-cream/40 text-xs ml-3">{m.email}</span>
                {m.phone && <span className="text-cream/40 text-xs ml-3">{m.phone}</span>}
              </div>
              <div className="text-cream/30 text-xs">{new Date(m.created_at).toLocaleDateString('en-IN')}</div>
            </div>
            {m.subject && <div className="text-cream/60 text-sm font-500 mb-2">{m.subject}</div>}
            <p className="text-cream/50 text-sm">{m.message}</p>
          </div>
        ))}
        {msgs.length === 0 && <p className="text-center text-cream/30 py-12">No messages yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Subscribers
// ============================================================
function SubscribersManager() {
  const [subs, setSubs] = useState([])
  useEffect(() => { api.get('/admin/subscribers', true).then(res => setSubs(res.data || [])) }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">Subscribers</h1>
        <div className="text-cream/40 text-sm">{subs.length} active subscribers</div>
      </div>
      <div className="bg-stone-900 border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-cream/30 text-xs uppercase">
              {['#', 'Email', 'Name', 'Subscribed At'].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {subs.map((s, i) => (
              <tr key={s.id} className="border-b border-white/5 text-cream/60 hover:bg-white/2">
                <td className="px-4 py-2 text-cream/30">{i + 1}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2 text-cream/40">{s.name || '—'}</td>
                <td className="px-4 py-2 text-cream/40 text-xs">{new Date(s.subscribed_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <p className="text-center text-cream/30 py-12">No subscribers yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Applications
// ============================================================
function ApplicationsManager() {
  const [apps, setApps] = useState([])
  useEffect(() => { api.get('/admin/applications', true).then(res => setApps(res.data || [])) }, [])

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-8">Career Applications</h1>
      <div className="space-y-3">
        {apps.map(a => (
          <div key={a.id} className="bg-stone-900 border border-white/5 p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="font-sans text-cream">{a.name}</span>
                <span className="text-brand-400 text-xs ml-3">{a.position}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 ${a.status === 'new' ? 'bg-brand-500/20 text-brand-300' : a.status === 'hired' ? 'bg-forest-500/20 text-forest-300' : 'bg-white/10 text-cream/50'}`}>{a.status}</span>
            </div>
            <div className="text-cream/40 text-xs mb-3">{a.email} {a.phone && `· ${a.phone}`}</div>
            {a.cover_letter && <p className="text-cream/50 text-sm line-clamp-3">{a.cover_letter}</p>}
          </div>
        ))}
        {apps.length === 0 && <p className="text-center text-cream/30 py-12">No applications yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Treks List Admin
// ============================================================
function TreksManager() {
  const [treks, setTreks] = useState([])
  useEffect(() => { api.get('/treks?limit=50').then(res => setTreks(res.data || [])) }, [])

  const toggle = async (id, is_active) => {
    await api.put(`/treks/${id}`, { is_active: !is_active }, true)
    setTreks(ts => ts.map(t => t.id === id ? { ...t, is_active: !is_active } : t))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">Treks</h1>
        <Link to="/admin/treks/new" className="btn-primary text-sm py-2 px-4">+ Add Trek</Link>
      </div>
      <div className="bg-stone-900 border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-cream/30 text-xs uppercase">
              {['Name', 'Category', 'Zone', 'Difficulty', 'Price', 'Featured', 'Active', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {treks.map(t => (
              <tr key={t.id} className="border-b border-white/5 text-cream/60 hover:bg-white/2">
                <td className="px-4 py-3 text-cream">{t.name}</td>
                <td className="px-4 py-3 text-cream/50 capitalize">{t.category}</td>
                <td className="px-4 py-3 text-cream/50 capitalize">{t.zone}</td>
                <td className="px-4 py-3 capitalize">{t.difficulty}</td>
                <td className="px-4 py-3">₹{Number(t.price_per_person).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">{t.is_featured ? '✓' : '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(t.id, t.is_active)}
                    className={`text-xs px-2 py-0.5 border ${t.is_active ? 'border-forest-500/30 text-forest-300' : 'border-red-500/30 text-red-300'}`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/treks/${t.slug}`} target="_blank" className="text-brand-400 hover:text-brand-300 text-xs">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {treks.length === 0 && <p className="text-center text-cream/30 py-12">No treks yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Events Admin
// ============================================================
function EventsManager() {
  const [events, setEvents] = useState([])
  useEffect(() => { api.get('/events').then(res => setEvents(res.data || [])) }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">Events</h1>
      </div>
      <div className="bg-stone-900 border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-cream/30 text-xs uppercase">
              {['Name', 'Date', 'Location', 'Price', 'Registered', 'Capacity', 'Featured'].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className="border-b border-white/5 text-cream/60 hover:bg-white/2">
                <td className="px-4 py-3 text-cream">{ev.name}</td>
                <td className="px-4 py-3 text-cream/50 text-xs">{new Date(ev.event_date).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-cream/50">{ev.location}</td>
                <td className="px-4 py-3">₹{Number(ev.price).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">{ev.registered_count}</td>
                <td className="px-4 py-3">{ev.max_participants}</td>
                <td className="px-4 py-3">{ev.is_featured ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <p className="text-center text-cream/30 py-12">No events yet</p>}
      </div>
    </div>
  )
}

// ============================================================
// Admin Guard
// ============================================================
function AdminGuard({ children }) {
  const { admin, loading } = useAuth()
  const navigate = useNavigate()
  useEffect(() => { if (!loading && !admin) navigate('/admin/login') }, [admin, loading])
  if (loading || !admin) return <div className="min-h-screen bg-stone-950 flex items-center justify-center"><div className="w-8 h-8 border border-brand-500/30 border-t-brand-500 rounded-full animate-spin" /></div>
  return children
}

// ============================================================
// Admin Router
// ============================================================
export function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="treks" element={<TreksManager />} />
          <Route path="events" element={<EventsManager />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="reviews" element={<ReviewsManager />} />
          <Route path="contacts" element={<ContactsManager />} />
          <Route path="subscribers" element={<SubscribersManager />} />
          <Route path="applications" element={<ApplicationsManager />} />
          <Route path="gallery" element={<GalleryAdminManager />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  )
}

// ============================================================
// Gallery Admin Manager
// ============================================================
function GalleryAdminManager() {
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ title: '', image_url: '', category: 'treks', location: '', captured_by: '' })
  const [adding, setAdding] = useState(false)
  const [state, setState] = useState({ loading: false, success: '', error: '' })

  useEffect(() => { api.get('/gallery').then(res => setImages(res.data || [])) }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const add = async e => {
    e.preventDefault()
    setState({ loading: true, success: '', error: '' })
    try {
      const res = await api.post('/gallery', form, true)
      if (res.success) {
        setState({ loading: false, success: 'Image added!', error: '' })
        setImages(imgs => [...imgs, { ...form, id: res.id }])
        setForm({ title: '', image_url: '', category: 'treks', location: '', captured_by: '' })
        setAdding(false)
      } else setState({ loading: false, success: '', error: res.message })
    } catch { setState({ loading: false, success: '', error: 'Failed to add image' }) }
  }

  const remove = async id => {
    if (!confirm('Remove this image?')) return
    await api.delete(`/gallery/${id}`, true)
    setImages(imgs => imgs.filter(i => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">Gallery</h1>
        <button onClick={() => setAdding(!adding)} className="btn-primary text-sm py-2 px-4">{adding ? 'Cancel' : '+ Add Image'}</button>
      </div>
      {adding && (
        <form onSubmit={add} className="bg-stone-900 border border-white/10 p-6 mb-6 grid grid-cols-2 gap-4">
          <input placeholder="Image URL *" required value={form.image_url} onChange={set('image_url')} className="input-field col-span-2" />
          <input placeholder="Title" value={form.title} onChange={set('title')} className="input-field" />
          <select value={form.category} onChange={set('category')} className="input-field">
            {['fireflies','camping','western_ghats','north_india','treks','stargazing','events'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Location" value={form.location} onChange={set('location')} className="input-field" />
          <input placeholder="Photographer" value={form.captured_by} onChange={set('captured_by')} className="input-field" />
          {state.error && <p className="text-red-400 text-xs col-span-2">{state.error}</p>}
          <button type="submit" disabled={state.loading} className="btn-primary col-span-2 justify-center">{state.loading ? 'Adding...' : 'Add Image'}</button>
        </form>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.map(img => (
          <div key={img.id} className="relative group aspect-square overflow-hidden bg-stone-900">
            <img src={img.image_url} alt={img.title || ''} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/70 transition-all flex items-center justify-center">
              <button onClick={() => remove(img.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs border border-red-400/40 px-3 py-1">Remove</button>
            </div>
            <div className="absolute bottom-1 left-1 text-cream/50 text-[10px] bg-stone-950/70 px-1">{img.category}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
