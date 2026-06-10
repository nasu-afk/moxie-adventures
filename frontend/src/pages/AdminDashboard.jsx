import API_BASE from '../utils/config'
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
      const res = await fetch(API_BASE + '/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(r => r.json())
      if (res.success) { loginAdmin(res); navigate('/admin') }
      else setState({ loading: false, error: res.message || 'Invalid credentials' })
    } catch { setState({ loading: false, error: 'Login failed. Is the backend running?' }) }
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
  { to: '/admin/bookings', label: 'Trek Bookings', icon: '📋' },
  { to: '/admin/registrations', label: 'Event Registrations', icon: '🎟' },
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
          {/* Logo — click to go to homepage */}
          <Link to="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 group mb-3">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0">
              <path d="M16 3L3 26H29L16 3Z" stroke="#c87820" strokeWidth="1.5" fill="none"/>
              <path d="M10 26L16 14L22 26" stroke="#c87820" strokeWidth="1" fill="none" opacity="0.5"/>
            </svg>
            <div>
              <span className="font-display text-base font-normal text-cream group-hover:text-brand-300 transition-colors leading-none">Moxie</span>
              <span className="font-display text-base font-light text-brand-400 group-hover:text-brand-300 transition-colors leading-none ml-1">Adventures</span>
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <div className="text-cream/30 text-xs">{admin?.name || 'Administrator'}</div>
            <span className="text-cream/20 text-[10px] bg-white/5 px-1.5 py-0.5 rounded">{admin?.role?.replace('_', ' ') || 'admin'}</span>
          </div>
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
    { label: 'Total Bookings', value: data.total_bookings, sub: `${data.trek_bookings || 0} treks · ${data.event_registrations || 0} events`, icon: '📋' },
    { label: 'Total Revenue', value: '₹' + Number(data.revenue || 0).toLocaleString('en-IN'), sub: 'Confirmed only', icon: '₹' },
    { label: 'Upcoming Events', value: data.upcoming_events, sub: 'Scheduled ahead', icon: '📅' },
    { label: 'Subscribers', value: data.subscribers, sub: 'Active newsletter', icon: '📧' },
    { label: 'Active Treks', value: data.active_treks, sub: 'Live on site', icon: '⛰' },
  ] : []

  const statusColor = s => {
    if (s === 'confirmed') return 'bg-forest-500/20 text-forest-300'
    if (s === 'cancelled') return 'bg-red-500/20 text-red-300'
    if (s === 'pending') return 'bg-brand-500/20 text-brand-300'
    return 'bg-white/10 text-cream/50'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-cream">Dashboard</h1>
        <span className="text-cream/30 text-xs">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {CARDS.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-stone-900 border border-white/5 p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cream/40 text-xs uppercase tracking-wider">{c.label}</span>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className="font-display text-3xl text-cream mb-1">{c.value ?? '—'}</div>
            <div className="text-cream/30 text-xs">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity — merged trek bookings + event registrations */}
      {data?.recent_bookings?.length > 0 && (
        <div className="bg-stone-900 border border-white/5 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-cream font-sans font-medium">Recent Activity</h3>
            <div className="flex gap-3 text-xs text-cream/30">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />Trek Booking</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />Event Registration</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-cream/30 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="text-left pb-3 pr-4">Ref</th>
                  <th className="text-left pb-3 pr-4">Type</th>
                  <th className="text-left pb-3 pr-4">Name</th>
                  <th className="text-left pb-3 pr-4">Item</th>
                  <th className="text-left pb-3 pr-4">Date</th>
                  <th className="text-left pb-3 pr-4">Amount</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_bookings.map((b, i) => (
                  <tr key={i} className="border-t border-white/5 text-cream/70 hover:bg-white/2">
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-mono ${b.type === 'event' ? 'text-purple-400' : 'text-brand-400'}`}>
                        {b.booking_ref || b.registration_ref}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 ${b.type === 'event' ? 'bg-purple-500/15 text-purple-300' : 'bg-brand-500/15 text-brand-300'}`}>
                        {b.type === 'event' ? '🎟 Event' : '⛰ Trek'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-cream">{b.name}</td>
                    <td className="py-2.5 pr-4 text-cream/50 text-xs">{b.item_name}</td>
                    <td className="py-2.5 pr-4 text-cream/40 text-xs">{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="py-2.5 pr-4">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 ${statusColor(b.status)}`}>{b.status}</span>
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
// Trek Images Manager
// ============================================================
function TrekImagesManager({ trek, onClose }) {
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ image_url: '', caption: '', sort_order: 0 })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get(`/treks/${trek.id}/images`).then(res => setImages(res.data || []))
  }

  useEffect(() => { load() }, [trek.id])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const add = async e => {
    e.preventDefault()
    if (!form.image_url.trim()) return
    setLoading(true)
    setMsg('')
    try {
      const res = await api.post(`/treks/${trek.id}/images`, form, true)
      if (res.success) {
        setForm({ image_url: '', caption: '', sort_order: images.length })
        setMsg('Image added!')
        load()
      } else setMsg(res.message || 'Failed to add')
    } catch { setMsg('Error adding image') }
    setLoading(false)
  }

  const remove = async (imageId) => {
    if (!confirm('Remove this image?')) return
    await api.delete(`/treks/${trek.id}/images/${imageId}`, true)
    setImages(imgs => imgs.filter(i => i.id !== imageId))
  }

  const inputCls = 'w-full bg-white/5 border border-white/15 text-cream placeholder-cream/30 px-3 py-2 text-sm font-sans focus:outline-none focus:border-brand-500'

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl text-cream">Trek Images</h2>
            <p className="text-cream/40 text-sm">{trek.name}</p>
          </div>
          <button onClick={onClose} className="text-cream/40 hover:text-cream text-3xl leading-none">×</button>
        </div>

        {/* Add Image Form */}
        <div className="bg-stone-900 border border-white/10 p-5 mb-6">
          <h3 className="text-cream font-sans font-medium mb-4 text-sm uppercase tracking-wider">Add New Image</h3>
          <form onSubmit={add} className="space-y-3">
            <div>
              <label className="text-cream/40 text-xs mb-1 block">Image URL *</label>
              <input
                placeholder="https://images.unsplash.com/photo-xxx?w=1200"
                value={form.image_url}
                onChange={set('image_url')}
                className={inputCls}
                required
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="mt-2 h-40 w-full object-cover opacity-80 border border-white/10"
                  onError={e => e.target.style.display = 'none'}
                  onLoad={e => e.target.style.display = 'block'}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Caption (optional)</label>
                <input placeholder="e.g. Summit view at dawn" value={form.caption} onChange={set('caption')} className={inputCls} />
              </div>
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Sort Order</label>
                <input type="number" min="0" value={form.sort_order} onChange={set('sort_order')} className={inputCls} />
              </div>
            </div>
            {msg && <p className={`text-xs ${msg.includes('Error') || msg.includes('Failed') ? 'text-red-400' : 'text-forest-400'}`}>{msg}</p>}
            <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">
              {loading ? 'Adding...' : '+ Add Image'}
            </button>
          </form>
        </div>

        {/* Tip box */}
        <div className="bg-brand-500/5 border border-brand-500/20 px-4 py-3 mb-6 text-xs text-cream/50">
          💡 <strong className="text-cream/70">Tip:</strong> Use Unsplash URLs like <code className="text-brand-400">https://images.unsplash.com/photo-ID?w=1200</code> or any direct image link. Images appear in the trek gallery tab on the website.
        </div>

        {/* Existing Images Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-cream font-sans font-medium text-sm uppercase tracking-wider">
              Gallery ({images.length} images)
            </h3>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 text-cream/30">
              <div className="text-4xl mb-3">🖼</div>
              <p>No images added yet</p>
              <p className="text-xs mt-1">Add images above to build the trek gallery</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-stone-900 border border-white/5 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={img.image_url}
                      alt={img.caption || ''}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-cream/60 text-xs truncate">{img.caption || <span className="italic text-cream/30">No caption</span>}</p>
                    <p className="text-cream/30 text-xs mt-0.5">Order: {img.sort_order}</p>
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => remove(img.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    ×
                  </button>
                  {/* Order badge */}
                  <div className="absolute top-2 left-2 bg-stone-950/70 text-cream/60 text-xs px-2 py-0.5">
                    #{i + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="btn-outline">Done</button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Trek Itinerary Manager
// ============================================================
function TrekItineraryManager({ trek, onClose }) {
  const [days, setDays] = useState([])
  const [form, setForm] = useState({ day_number: '', title: '', description: '', altitude: '', distance: '', stay: '', meals: '' })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get(`/treks/${trek.id}/itinerary`).then(res => {
      const data = res.data || []
      setDays(data)
      setForm(f => ({ ...f, day_number: data.length + 1 }))
    })
  }

  useEffect(() => { load() }, [trek.id])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async e => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      let res
      if (editId) {
        res = await api.put(`/treks/${trek.id}/itinerary/${editId}`, form, true)
      } else {
        res = await api.post(`/treks/${trek.id}/itinerary`, form, true)
      }
      if (res.success) {
        setMsg(editId ? 'Day updated!' : 'Day added!')
        setForm({ day_number: days.length + 2, title: '', description: '', altitude: '', distance: '', stay: '', meals: '' })
        setEditId(null)
        load()
      } else setMsg(res.message || 'Failed')
    } catch { setMsg('Error saving') }
    setLoading(false)
  }

  const startEdit = (day) => {
    setEditId(day.id)
    setForm({
      day_number: day.day_number,
      title: day.title,
      description: day.description || '',
      altitude: day.altitude || '',
      distance: day.distance || '',
      stay: day.stay || '',
      meals: day.meals || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (dayId) => {
    if (!confirm('Delete this day?')) return
    await api.delete(`/treks/${trek.id}/itinerary/${dayId}`, true)
    setDays(ds => ds.filter(d => d.id !== dayId))
  }

  const inputCls = 'w-full bg-white/5 border border-white/15 text-cream placeholder-cream/30 px-3 py-2 text-sm font-sans focus:outline-none focus:border-brand-500'

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl text-cream">Day-wise Itinerary</h2>
            <p className="text-cream/40 text-sm">{trek.name}</p>
          </div>
          <button onClick={onClose} className="text-cream/40 hover:text-cream text-3xl leading-none">×</button>
        </div>

        {/* Add/Edit Day Form */}
        <div className="bg-stone-900 border border-white/10 p-5 mb-6">
          <h3 className="text-cream font-sans font-medium mb-4 text-sm uppercase tracking-wider">
            {editId ? 'Edit Day' : 'Add New Day'}
          </h3>
          <form onSubmit={save} className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Day Number *</label>
                <input type="number" min="1" required value={form.day_number} onChange={set('day_number')} className={inputCls} />
              </div>
              <div className="col-span-3">
                <label className="text-cream/40 text-xs mb-1 block">Day Title *</label>
                <input placeholder="e.g. Manebhanjyang to Meghma" required value={form.title} onChange={set('title')} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-cream/40 text-xs mb-1 block">Description</label>
              <textarea placeholder="Describe what happens on this day..." value={form.description} onChange={set('description')} rows={3} className={inputCls + ' resize-none'} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Altitude (m)</label>
                <input type="number" placeholder="2440" value={form.altitude} onChange={set('altitude')} className={inputCls} />
              </div>
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Distance (km)</label>
                <input type="number" step="0.1" placeholder="12.5" value={form.distance} onChange={set('distance')} className={inputCls} />
              </div>
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Stay</label>
                <input placeholder="Guesthouse" value={form.stay} onChange={set('stay')} className={inputCls} />
              </div>
              <div>
                <label className="text-cream/40 text-xs mb-1 block">Meals</label>
                <input placeholder="Breakfast, Dinner" value={form.meals} onChange={set('meals')} className={inputCls} />
              </div>
            </div>
            {msg && <p className={`text-xs ${msg.includes('Error') || msg.includes('Failed') ? 'text-red-400' : 'text-forest-400'}`}>{msg}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">
                {loading ? 'Saving...' : editId ? 'Update Day' : '+ Add Day'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ day_number: days.length + 1, title: '', description: '', altitude: '', distance: '', stay: '', meals: '' }) }} className="btn-outline text-sm py-2 px-4">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Days List */}
        <div className="space-y-3">
          {days.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 text-cream/30">
              <p>No itinerary days added yet</p>
            </div>
          ) : days.map((day, i) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-stone-900 border border-white/5 p-4 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-brand-400 text-lg">{day.day_number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-cream font-sans font-medium">{day.title}</h4>
                {day.description && <p className="text-cream/50 text-xs mt-1 line-clamp-2">{day.description}</p>}
                <div className="flex flex-wrap gap-4 mt-2 text-cream/40 text-xs">
                  {day.altitude && <span>↑ {day.altitude}m</span>}
                  {day.distance && <span>↔ {day.distance}km</span>}
                  {day.stay && <span>🏠 {day.stay}</span>}
                  {day.meals && <span>🍽 {day.meals}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(day)} className="text-xs border border-brand-500/30 text-brand-400 px-3 py-1 hover:bg-brand-500/10 transition-colors">Edit</button>
                <button onClick={() => remove(day.id)} className="text-xs border border-red-500/30 text-red-400 px-3 py-1 hover:bg-red-500/10 transition-colors">Del</button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="btn-outline">Done</button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Add / Edit Trek Form
// ============================================================
function TrekForm({ trek, onSave, onCancel }) {
  const EMPTY = {
    slug: '', name: '', tagline: '', category: 'trekking', zone: 'north',
    difficulty: 'moderate', duration_days: '', max_altitude: '', best_season: '',
    min_group_size: 2, max_group_size: 20, price_per_person: '', original_price: '',
    overview: '', cover_image: '', is_featured: false, is_active: true,
    highlights: '', inclusions: '', exclusions: ''
  }
  const [form, setForm] = useState(trek ? {
    ...trek,
    highlights: Array.isArray(trek.highlights) ? trek.highlights.join('\n') : (trek.highlights || ''),
    inclusions: Array.isArray(trek.inclusions) ? trek.inclusions.join('\n') : (trek.inclusions || ''),
    exclusions: Array.isArray(trek.exclusions) ? trek.exclusions.join('\n') : (trek.exclusions || ''),
  } : EMPTY)
  const [state, setState] = useState({ loading: false, error: '', success: '' })

  const set = k => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  // Auto-generate slug from name
  const handleName = e => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm(f => ({ ...f, name, slug: trek ? f.slug : slug }))
  }

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, error: '', success: '' })
    try {
      const payload = {
        ...form,
        highlights: form.highlights.split('\n').filter(l => l.trim()),
        inclusions: form.inclusions.split('\n').filter(l => l.trim()),
        exclusions: form.exclusions.split('\n').filter(l => l.trim()),
        duration_days: parseInt(form.duration_days) || 1,
        max_altitude: parseInt(form.max_altitude) || null,
        price_per_person: parseFloat(form.price_per_person) || 0,
        original_price: parseFloat(form.original_price) || null,
        min_group_size: parseInt(form.min_group_size) || 2,
        max_group_size: parseInt(form.max_group_size) || 20,
      }
      let res
      if (trek) {
        res = await api.put(`/treks/${trek.id}`, payload, true)
      } else {
        res = await api.post('/treks', payload, true)
      }
      if (res.success) {
        setState({ loading: false, success: trek ? 'Trek updated!' : 'Trek created!', error: '' })
        setTimeout(() => onSave(), 1000)
      } else {
        setState({ loading: false, error: res.message || 'Failed to save trek', success: '' })
      }
    } catch (err) {
      setState({ loading: false, error: 'Something went wrong: ' + err.message, success: '' })
    }
  }

  const inputCls = 'w-full bg-white/5 border border-white/15 text-cream placeholder-cream/30 px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-500 transition-colors duration-200'
  const selectCls = 'w-full bg-stone-800 border border-white/15 text-cream px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-500'
  const labelCls = 'block text-cream/40 text-xs uppercase tracking-wider mb-1.5'

  return (
    <div className="bg-stone-900 border border-white/10 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-cream">{trek ? 'Edit Trek' : 'Add New Trek'}</h2>
        <button onClick={onCancel} className="text-cream/40 hover:text-cream text-2xl leading-none">×</button>
      </div>

      {state.error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm mb-5">{state.error}</div>}
      {state.success && <div className="bg-forest-500/10 border border-forest-500/30 text-forest-300 px-4 py-3 text-sm mb-5">✓ {state.success}</div>}

      <form onSubmit={submit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Basic Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Trek Name *</label>
              <input placeholder="e.g. Sandakphu Trek" required value={form.name} onChange={handleName} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug (URL) *</label>
              <input placeholder="e.g. sandakphu-trek" required value={form.slug} onChange={set('slug')} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Tagline</label>
              <input placeholder="e.g. The Roof of West Bengal" value={form.tagline} onChange={set('tagline')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={set('category')} className={selectCls}>
                <option value="trekking">Trekking</option>
                <option value="camping">Camping</option>
                <option value="stargazing">Stargazing</option>
                <option value="yatra">Spiritual Yatra</option>
                <option value="expedition">Expedition</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Zone *</label>
              <select value={form.zone} onChange={set('zone')} className={selectCls}>
                <option value="north">North</option>
                <option value="west">West</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="central">Central</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Difficulty *</label>
              <select value={form.difficulty} onChange={set('difficulty')} className={selectCls}>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="difficult">Difficult</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Best Season</label>
              <input placeholder="e.g. October–March" value={form.best_season} onChange={set('best_season')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Duration & Altitude */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Trek Details</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Duration (Days) *</label>
              <input type="number" min="1" placeholder="6" required value={form.duration_days} onChange={set('duration_days')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Max Altitude (m)</label>
              <input type="number" placeholder="3636" value={form.max_altitude} onChange={set('max_altitude')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Min Group Size</label>
              <input type="number" min="1" value={form.min_group_size} onChange={set('min_group_size')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Max Group Size</label>
              <input type="number" min="1" value={form.max_group_size} onChange={set('max_group_size')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price Per Person (₹) *</label>
              <input type="number" min="0" placeholder="8999" required value={form.price_per_person} onChange={set('price_per_person')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Original Price (₹) — for discount display</label>
              <input type="number" min="0" placeholder="11999" value={form.original_price} onChange={set('original_price')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Media</p>
          <div>
            <label className={labelCls}>Cover Image URL *</label>
            <input placeholder="https://images.unsplash.com/..." required value={form.cover_image} onChange={set('cover_image')} className={inputCls} />
            {form.cover_image && (
              <img src={form.cover_image} alt="Preview" className="mt-2 h-32 w-full object-cover opacity-70" onError={e => e.target.style.display='none'} />
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Content</p>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Overview / Description *</label>
              <textarea required placeholder="Describe the trek in detail..." value={form.overview} onChange={set('overview')} rows={5} className={inputCls + ' resize-none'} />
            </div>
            <div>
              <label className={labelCls}>Highlights — one per line</label>
              <textarea placeholder={"Views of 4 of the 5 tallest peaks\nWalk through Singalila National Park\nSunrise over the Himalayas"} value={form.highlights} onChange={set('highlights')} rows={4} className={inputCls + ' resize-none'} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Inclusions — one per line</label>
                <textarea placeholder={"Trek Leader\nAll meals\nAccommodation\nPermits"} value={form.inclusions} onChange={set('inclusions')} rows={5} className={inputCls + ' resize-none'} />
              </div>
              <div>
                <label className={labelCls}>Exclusions — one per line</label>
                <textarea placeholder={"Flights and trains\nPersonal gear\nTravel insurance"} value={form.exclusions} onChange={set('exclusions')} rows={5} className={inputCls + ' resize-none'} />
              </div>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Settings</p>
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="w-4 h-4 accent-brand-500" />
              <span className="text-cream/70 text-sm">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="w-4 h-4 accent-brand-500" />
              <span className="text-cream/70 text-sm">Active (visible on site)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-white/5">
          <button type="submit" disabled={state.loading} className="btn-primary">
            {state.loading ? 'Saving...' : trek ? 'Update Trek' : 'Create Trek'}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  )
}

// ============================================================
// Treks List Admin
// ============================================================
function TreksManager() {
  const [treks, setTreks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTrek, setEditTrek] = useState(null)
  const [imagesTrek, setImagesTrek] = useState(null)
  const [itineraryTrek, setItineraryTrek] = useState(null)

  const load = () => {
    api.get('/treks?limit=50').then(res => setTreks(res.data || []))
  }

  useEffect(() => { load() }, [])

  const toggle = async (id, is_active) => {
    await api.put(`/treks/${id}`, { is_active: !is_active }, true)
    setTreks(ts => ts.map(t => t.id === id ? { ...t, is_active: !is_active } : t))
  }

  const handleSave = () => {
    setShowForm(false)
    setEditTrek(null)
    load()
  }

  const handleEdit = (trek) => {
    setEditTrek(trek)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Images Manager Modal */}
      {imagesTrek && (
        <TrekImagesManager trek={imagesTrek} onClose={() => setImagesTrek(null)} />
      )}

      {/* Itinerary Manager Modal */}
      {itineraryTrek && (
        <TrekItineraryManager trek={itineraryTrek} onClose={() => setItineraryTrek(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-cream">Treks</h1>
        {!showForm && (
          <button onClick={() => { setEditTrek(null); setShowForm(true) }} className="btn-primary text-sm py-2 px-4">
            + Add Trek
          </button>
        )}
      </div>

      {showForm && (
        <TrekForm
          trek={editTrek}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTrek(null) }}
        />
      )}

      <div className="bg-stone-900 border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-cream/30 text-xs uppercase">
              {['Name', 'Category', 'Difficulty', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {treks.map(t => (
              <tr key={t.id} className="border-b border-white/5 text-cream/60 hover:bg-white/2">
                <td className="px-4 py-3">
                  <div className="text-cream font-medium">{t.name}</div>
                  <div className="text-cream/30 text-xs capitalize">{t.zone} zone</div>
                </td>
                <td className="px-4 py-3 text-cream/50 capitalize">{t.category}</td>
                <td className="px-4 py-3 capitalize">{t.difficulty}</td>
                <td className="px-4 py-3">
                  <div>₹{Number(t.price_per_person).toLocaleString('en-IN')}</div>
                  {t.is_featured ? <span className="text-brand-400 text-xs">★ Featured</span> : null}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(t.id, t.is_active)}
                    className={`text-xs px-2 py-0.5 border ${t.is_active ? 'border-forest-500/30 text-forest-300' : 'border-red-500/30 text-red-300'}`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleEdit(t)} className="text-xs border border-brand-500/30 text-brand-400 px-2 py-1 hover:bg-brand-500/10 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => setImagesTrek(t)} className="text-xs border border-purple-500/30 text-purple-400 px-2 py-1 hover:bg-purple-500/10 transition-colors">
                      🖼 Images
                    </button>
                    <button onClick={() => setItineraryTrek(t)} className="text-xs border border-forest-500/30 text-forest-400 px-2 py-1 hover:bg-forest-500/10 transition-colors">
                      📅 Itinerary
                    </button>
                    <Link to={`/treks/${t.slug}`} target="_blank" className="text-xs border border-white/10 text-cream/40 px-2 py-1 hover:text-cream transition-colors">
                      View ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {treks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-cream/30 text-sm mb-4">No treks yet</p>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-5">+ Add Your First Trek</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Events Admin
// ============================================================
// ============================================================
// Event Registrations Manager
// ============================================================
function EventRegistrationsManager() {
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/admin/event-registrations', true)
      .then(res => setRegs(res.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    const res = await api.put(`/admin/event-registrations/${id}`, { status }, true)
    if (res.success) setRegs(rs => rs.map(r => r.id === id ? { ...r, status } : r))
  }

  const filtered = regs
    .filter(r => filter === 'all' ? true : r.status === filter)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.registration_ref.toLowerCase().includes(search.toLowerCase()) ||
      r.event_name.toLowerCase().includes(search.toLowerCase()))

  const statusColor = s => {
    if (s === 'confirmed') return 'bg-forest-500/20 text-forest-300'
    if (s === 'cancelled') return 'bg-red-500/20 text-red-300'
    return 'bg-brand-500/20 text-brand-300'
  }

  const totalRevenue = filtered
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-cream">Event Registrations</h1>
          <p className="text-cream/40 text-sm mt-1">{regs.length} total registrations</p>
        </div>
        <div className="text-right">
          <div className="text-cream/40 text-xs uppercase tracking-wider mb-1">Showing Revenue</div>
          <div className="font-display text-2xl text-forest-400">₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, email, ref, event..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 text-cream placeholder-cream/30 px-3 py-2 text-sm focus:outline-none focus:border-brand-500 w-64"
        />
        <div className="flex gap-2">
          {[
            { key: 'all', label: `All (${regs.length})` },
            { key: 'pending', label: `Pending (${regs.filter(r => r.status === 'pending').length})` },
            { key: 'confirmed', label: `Confirmed (${regs.filter(r => r.status === 'confirmed').length})` },
            { key: 'cancelled', label: `Cancelled (${regs.filter(r => r.status === 'cancelled').length})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-all ${filter === f.key ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/30'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-cream/30">Loading registrations...</div>
      ) : (
        <div className="bg-stone-900 border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-cream/30 text-xs uppercase">
                {['Ref', 'Name', 'Email', 'Phone', 'Event', 'Event Date', 'Pax', 'Amount', 'Registered On', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 text-cream/60 hover:bg-white/2">
                  <td className="px-4 py-3">
                    <span className="text-purple-400 text-xs font-mono">{r.registration_ref}</span>
                  </td>
                  <td className="px-4 py-3 text-cream font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-cream/50 text-xs">{r.email}</td>
                  <td className="px-4 py-3 text-cream/50 text-xs">{r.phone || '—'}</td>
                  <td className="px-4 py-3 text-cream/70 whitespace-nowrap">{r.event_name}</td>
                  <td className="px-4 py-3 text-cream/40 text-xs whitespace-nowrap">
                    {new Date(r.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-center">{r.participants}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-cream">₹{Number(r.total_amount).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-4 py-3 text-cream/40 text-xs whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    <div>{new Date(r.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${statusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      className="bg-stone-800 border border-white/10 text-cream text-xs px-2 py-1 focus:outline-none focus:border-brand-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-cream/30">
              <p className="text-lg mb-1">No registrations found</p>
              <p className="text-xs">{search ? 'Try a different search term' : 'Registrations will appear here when users register for events'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Event Form (Add / Edit)
// ============================================================
function EventForm({ event, onSave, onCancel }) {
  const EMPTY = {
    slug: '', name: '', tagline: '', category: 'event', description: '',
    cover_image: '', location: '', event_date: '', end_date: '',
    price: '', max_participants: 50, is_featured: false, is_active: true
  }

  const [form, setForm] = useState(event ? {
    ...event,
    event_date: event.event_date ? event.event_date.slice(0, 10) : '',
    end_date: event.end_date ? event.end_date.slice(0, 10) : '',
  } : EMPTY)
  const [state, setState] = useState({ loading: false, error: '', success: '' })

  const set = k => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  const handleName = e => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm(f => ({ ...f, name, slug: event ? f.slug : slug }))
  }

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, error: '', success: '' })
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        max_participants: parseInt(form.max_participants) || 50,
      }
      let res
      if (event) {
        res = await api.put(`/events/${event.id}`, payload, true)
      } else {
        res = await api.post('/events', payload, true)
      }
      if (res.success) {
        setState({ loading: false, success: event ? 'Event updated!' : 'Event created!', error: '' })
        setTimeout(() => onSave(), 1000)
      } else {
        setState({ loading: false, error: res.message || 'Failed to save event', success: '' })
      }
    } catch (err) {
      setState({ loading: false, error: 'Something went wrong: ' + err.message, success: '' })
    }
  }

  const inputCls = 'w-full bg-white/5 border border-white/15 text-cream placeholder-cream/30 px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-500 transition-colors duration-200'
  const selectCls = 'w-full bg-stone-800 border border-white/15 text-cream px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-brand-500'
  const labelCls = 'block text-cream/40 text-xs uppercase tracking-wider mb-1.5'

  return (
    <div className="bg-stone-900 border border-white/10 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-cream">{event ? 'Edit Event' : 'Add New Event'}</h2>
        <button onClick={onCancel} className="text-cream/40 hover:text-cream text-2xl leading-none">×</button>
      </div>

      {state.error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm mb-5">{state.error}</div>}
      {state.success && <div className="bg-forest-500/10 border border-forest-500/30 text-forest-300 px-4 py-3 text-sm mb-5">✓ {state.success}</div>}

      <form onSubmit={submit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Basic Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Event Name *</label>
              <input placeholder="e.g. Firefly Night Camp" required value={form.name} onChange={handleName} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug (URL) *</label>
              <input placeholder="e.g. firefly-night-camp" required value={form.slug} onChange={set('slug')} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Tagline</label>
              <input placeholder="e.g. A magical evening in the bioluminescent forest" value={form.tagline} onChange={set('tagline')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={set('category')} className={selectCls}>
                <option value="event">General Event</option>
                <option value="trekking">Trekking</option>
                <option value="camping">Camping</option>
                <option value="stargazing">Stargazing</option>
                <option value="yatra">Spiritual Yatra</option>
                <option value="expedition">Expedition</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Location *</label>
              <input placeholder="e.g. Bhimashankar, Maharashtra" required value={form.location} onChange={set('location')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Dates & Capacity</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Start Date *</label>
              <input type="date" required value={form.event_date} onChange={set('event_date')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="date" value={form.end_date} onChange={set('end_date')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input type="number" min="0" placeholder="1999" required value={form.price} onChange={set('price')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Max Participants</label>
              <input type="number" min="1" value={form.max_participants} onChange={set('max_participants')} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Media</p>
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input placeholder="https://images.unsplash.com/..." value={form.cover_image} onChange={set('cover_image')} className={inputCls} />
            {form.cover_image && (
              <img src={form.cover_image} alt="Preview" className="mt-2 h-32 w-full object-cover opacity-70 border border-white/10" onError={e => e.target.style.display = 'none'} />
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Description</p>
          <div>
            <label className={labelCls}>Event Description</label>
            <textarea placeholder="Describe the event in detail..." value={form.description} onChange={set('description')} rows={5} className={inputCls + ' resize-none'} />
          </div>
        </div>

        {/* Settings */}
        <div>
          <p className="text-brand-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-white/5">Settings</p>
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="w-4 h-4 accent-brand-500" />
              <span className="text-cream/70 text-sm">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="w-4 h-4 accent-brand-500" />
              <span className="text-cream/70 text-sm">Active (visible on site)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-white/5">
          <button type="submit" disabled={state.loading} className="btn-primary">
            {state.loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  )
}

// ============================================================
// Events Manager
// ============================================================
function EventsManager() {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = () => {
    // Use admin endpoint to get ALL events including hidden ones
    api.get('/admin/events', true).then(res => setEvents(res.data || []))
  }

  useEffect(() => { load() }, [])

  const handleSave = () => {
    setShowForm(false)
    setEditEvent(null)
    load()
  }

  const handleEdit = (ev) => {
    setEditEvent(ev)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleActive = async (ev) => {
    const res = await api.put(`/events/${ev.id}`, {
      ...ev,
      is_active: ev.is_active ? 0 : 1,
      event_date: ev.event_date ? ev.event_date.slice(0, 10) : '',
      end_date: ev.end_date ? ev.end_date.slice(0, 10) : '',
    }, true)
    if (res.success) {
      setEvents(evs => evs.map(e => e.id === ev.id ? { ...e, is_active: e.is_active ? 0 : 1 } : e))
    }
  }

  const toggleFeatured = async (ev) => {
    const res = await api.put(`/events/${ev.id}`, {
      ...ev,
      is_featured: ev.is_featured ? 0 : 1,
      event_date: ev.event_date ? ev.event_date.slice(0, 10) : '',
      end_date: ev.end_date ? ev.end_date.slice(0, 10) : '',
    }, true)
    if (res.success) {
      setEvents(evs => evs.map(e => e.id === ev.id ? { ...e, is_featured: e.is_featured ? 0 : 1 } : e))
    }
  }

  const filtered = filter === 'all' ? events : filter === 'active' ? events.filter(e => e.is_active) : events.filter(e => !e.is_active)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-cream">Events</h1>
        {!showForm && (
          <button onClick={() => { setEditEvent(null); setShowForm(true) }} className="btn-primary text-sm py-2 px-4">
            + Add Event
          </button>
        )}
      </div>

      {showForm && (
        <EventForm
          event={editEvent}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditEvent(null) }}
        />
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all', label: `All (${events.length})` },
          { key: 'active', label: `Active (${events.filter(e => e.is_active).length})` },
          { key: 'hidden', label: `Hidden (${events.filter(e => !e.is_active).length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider border transition-all ${filter === f.key ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/30'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-stone-900 border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-cream/30 text-xs uppercase">
              {['Event', 'Date', 'Location', 'Price', 'Spots', 'Featured', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(ev => (
              <tr key={ev.id} className={`border-b border-white/5 hover:bg-white/2 ${!ev.is_active ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="text-cream font-medium">{ev.name}</div>
                  <div className="text-cream/30 text-xs capitalize">{ev.category}</div>
                </td>
                <td className="px-4 py-3 text-cream/50 text-xs">
                  {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {ev.end_date && ev.end_date !== ev.event_date && (
                    <div className="text-cream/30">→ {new Date(ev.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-cream/50 text-xs max-w-[120px] truncate">{ev.location}</td>
                <td className="px-4 py-3 text-cream">₹{Number(ev.price).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <div className="text-cream/70 text-xs">{ev.registered_count} / {ev.max_participants}</div>
                  <div className="w-full bg-white/5 h-1 mt-1 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.min(100, (ev.registered_count / ev.max_participants) * 100)}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleFeatured(ev)}
                    className={`text-xs px-2 py-0.5 border transition-colors ${ev.is_featured ? 'border-brand-500/40 text-brand-400 bg-brand-500/10' : 'border-white/10 text-cream/30 hover:text-brand-400 hover:border-brand-500/30'}`}>
                    {ev.is_featured ? '★ Yes' : '☆ No'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(ev)}
                    className={`text-xs px-2 py-0.5 border transition-colors ${ev.is_active ? 'border-forest-500/30 text-forest-300' : 'border-red-500/30 text-red-300'}`}>
                    {ev.is_active ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(ev)} className="text-xs border border-brand-500/30 text-brand-400 px-2 py-1 hover:bg-brand-500/10 transition-colors">
                      Edit
                    </button>
                    <Link to={`/events/${ev.slug}`} target="_blank" className="text-xs border border-white/10 text-cream/40 px-2 py-1 hover:text-cream transition-colors">
                      View ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-cream/30 text-sm mb-4">No events found</p>
            {filter === 'all' && (
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-5">+ Add Your First Event</button>
            )}
          </div>
        )}
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
          <Route path="registrations" element={<EventRegistrationsManager />} />
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
