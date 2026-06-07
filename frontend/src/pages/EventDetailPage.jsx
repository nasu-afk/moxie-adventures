import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'

export default function EventDetailPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', phone: '', participants: 1 })
  const [state, setState] = useState({ loading: false, success: '', error: '' })

  useEffect(() => {
    api.get(`/events/${slug}`).then(res => { if (res.success) setEvent(res.data) }).finally(() => setLoading(false))
  }, [slug])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, success: '', error: '' })
    try {
      const res = await api.post(`/events/${event.id}/register`, form)
      if (res.success) setState({ loading: false, success: `Registration confirmed! Ref: ${res.ref}. Total: ₹${Number(res.total).toLocaleString('en-IN')}`, error: '' })
      else setState({ loading: false, success: '', error: res.message })
    } catch { setState({ loading: false, success: '', error: 'Something went wrong' }) }
  }

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  )

  if (!event) return (
    <div className="min-h-screen pt-20 flex items-center justify-center text-center">
      <div>
        <h2 className="font-display text-3xl text-cream mb-4">Event not found</h2>
        <Link to="/events" className="btn-primary">Back to Events</Link>
      </div>
    </div>
  )

  const isFull = event.registered_count >= event.max_participants
  const spotsLeft = event.max_participants - event.registered_count

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={event.cover_image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920'} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-stone-950/30" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-5 lg:px-8 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-brand-500 text-white text-xs px-3 py-1">
                {new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-cream/50 text-sm capitalize">{event.category}</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-300 mb-2">{event.name}</h1>
            {event.tagline && <p className="text-cream/60 text-lg italic">{event.tagline}</p>}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Date', value: new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
                { label: 'Location', value: event.location },
                { label: 'Capacity', value: `${event.max_participants} spots` },
                { label: 'Spots Left', value: isFull ? 'FULL' : spotsLeft + ' left' },
              ].map(item => (
                <div key={item.label} className="border border-white/10 p-4 text-center">
                  <div className="text-cream/40 text-xs uppercase tracking-wider mb-1">{item.label}</div>
                  <div className={`font-sans text-sm font-500 ${item.label === 'Spots Left' && !isFull && spotsLeft <= 5 ? 'text-red-300' : 'text-cream'}`}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h2 className="font-display text-3xl text-cream mb-5">About This Event</h2>
                <p className="text-cream/60 font-sans leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Highlights */}
            {event.highlights && (() => {
              try {
                const h = typeof event.highlights === 'string' ? JSON.parse(event.highlights) : event.highlights
                if (h && h.length) return (
                  <div>
                    <h3 className="font-display text-2xl text-cream mb-5">Highlights</h3>
                    <ul className="space-y-3">
                      {h.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-cream/70 text-sm font-sans">
                          <span className="text-brand-400 mt-0.5">✦</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              } catch {}
              return null
            })()}
          </div>

          {/* Registration sidebar */}
          <div>
            <div className="glass border border-white/10 p-6 sticky top-28">
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-3xl text-cream font-600">₹{Number(event.price).toLocaleString('en-IN')}</span>
                  <span className="text-cream/40 text-sm">/ person</span>
                </div>
                {!isFull && spotsLeft <= 10 && (
                  <p className="text-red-300 text-xs mt-1">⚠ Only {spotsLeft} spots remaining!</p>
                )}
              </div>

              {isFull ? (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 text-sm text-center">
                  This event is fully booked. Join the waitlist by contacting us.
                </div>
              ) : state.success ? (
                <div className="bg-forest-500/10 border border-forest-500/30 text-forest-300 p-4 text-sm">
                  ✓ {state.success}
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <input placeholder="Your Name" required value={form.name} onChange={set('name')} className="input-field" />
                  <input type="email" placeholder="Email" required value={form.email} onChange={set('email')} className="input-field" />
                  <input placeholder="Phone" required value={form.phone} onChange={set('phone')} className="input-field" />
                  <div>
                    <label className="text-cream/40 text-xs mb-1 block">Participants</label>
                    <input type="number" min="1" max={spotsLeft} value={form.participants} onChange={set('participants')} className="input-field" />
                  </div>
                  {state.error && <p className="text-red-400 text-xs">{state.error}</p>}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-cream/60">Total</span>
                      <span className="text-cream font-600">₹{Number(event.price * form.participants).toLocaleString('en-IN')}</span>
                    </div>
                    <button type="submit" disabled={state.loading} className="btn-primary w-full justify-center">
                      {state.loading ? 'Registering...' : 'Register Now'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-5 pt-5 border-t border-white/5 text-center">
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-forest-400 hover:text-forest-300 text-sm flex items-center justify-center gap-2 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Questions? Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
