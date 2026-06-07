import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('grid')

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data || [])).finally(() => setLoading(false))
  }, [])

  const CATS = ['all', 'trekking', 'camping', 'stargazing', 'yatra', 'event']
  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter)

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920" alt="Events" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-950/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-tag mb-3">Join the Adventure</p>
          <h1 className="font-display text-5xl md:text-6xl text-cream font-300">
            Upcoming <span className="italic text-brand-400">Events</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {/* Filters & View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {CATS.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 text-xs uppercase tracking-wider font-sans border transition-all duration-200 ${filter === c ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-cream/50 hover:border-white/30 hover:text-cream'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['grid', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-4 py-2 text-xs uppercase tracking-wider font-sans border transition-all ${view === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/30'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-stone-900/50 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-cream/40">
            <p className="font-display text-3xl mb-2">No events found</p>
            <p className="text-sm">Check back soon for new adventures!</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group border border-white/5 hover:border-brand-500/30 bg-stone-900/40 transition-colors duration-300 overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <img src={ev.cover_image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'} alt={ev.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-stone-950/70 backdrop-blur-sm px-2.5 py-1 text-xs text-cream/70 border border-white/10">{ev.category}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-brand-500 text-white text-xs px-3 py-1">
                      {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {ev.registered_count >= ev.max_participants && (
                    <div className="absolute top-4 right-4 bg-red-500/80 text-white text-xs px-2 py-1">FULL</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-cream font-400 mb-1 group-hover:text-brand-300 transition-colors">{ev.name}</h3>
                  {ev.tagline && <p className="text-cream/50 text-sm italic mb-3">{ev.tagline}</p>}
                  <div className="flex items-center gap-1 text-cream/40 text-xs mb-4">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    {ev.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-cream font-sans text-lg">₹{Number(ev.price).toLocaleString('en-IN')}</span>
                      <span className="text-cream/40 text-xs ml-1">/ person</span>
                    </div>
                    <Link to={`/events/${ev.slug}`} className="btn-primary text-xs py-2 px-4">
                      {ev.registered_count >= ev.max_participants ? 'View' : 'Register'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-6 p-5 border border-white/5 hover:border-brand-500/20 bg-stone-900/30 group transition-colors">
                <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 flex flex-col items-center justify-center flex-shrink-0">
                  <div className="font-display text-2xl text-brand-400 leading-none">{new Date(ev.event_date).getDate()}</div>
                  <div className="text-cream/40 text-xs uppercase">{new Date(ev.event_date).toLocaleString('default', { month: 'short' })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-cream font-500 group-hover:text-brand-300 transition-colors truncate">{ev.name}</h3>
                  <div className="flex items-center gap-4 text-cream/40 text-xs mt-1">
                    <span>📍 {ev.location}</span>
                    <span className="capitalize">{ev.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="text-cream font-sans hidden md:block">₹{Number(ev.price).toLocaleString('en-IN')}</span>
                  <Link to={`/events/${ev.slug}`} className="btn-outline text-xs py-2 px-4">Details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
