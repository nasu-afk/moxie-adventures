import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'

const DIFFICULTY_CLASS = {
  easy: 'difficulty-easy', moderate: 'difficulty-moderate',
  difficult: 'difficulty-difficult', extreme: 'difficulty-extreme'
}

function BookingForm({ trek }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', participants: 1, trek_date: '', special_requests: '' })
  const [state, setState] = useState({ loading: false, success: '', error: '' })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const total = trek.price_per_person * form.participants

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, success: '', error: '' })
    try {
      const res = await api.post(`/treks/${trek.id}/book`, form)
      if (res.success) setState({ loading: false, success: `Booking confirmed! Ref: ${res.booking_ref}. Total: ₹${Number(res.total_amount).toLocaleString('en-IN')}`, error: '' })
      else setState({ loading: false, success: '', error: res.message })
    } catch { setState({ loading: false, success: '', error: 'Something went wrong' }) }
  }

  return (
    <div className="glass border border-white/10 p-6 sticky top-28">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-sans text-3xl text-cream font-600">₹{Number(trek.price_per_person).toLocaleString('en-IN')}</span>
          <span className="text-cream/40 text-sm">/ person</span>
        </div>
        {trek.original_price > trek.price_per_person && (
          <span className="text-cream/30 text-sm line-through">₹{Number(trek.original_price).toLocaleString('en-IN')}</span>
        )}
      </div>

      {state.success ? (
        <div className="bg-forest-500/10 border border-forest-500/30 text-forest-300 p-4 text-sm rounded">{state.success}</div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input placeholder="Your Name" required value={form.name} onChange={set('name')} className="input-field" />
          <input type="email" placeholder="Email" required value={form.email} onChange={set('email')} className="input-field" />
          <input placeholder="Phone" required value={form.phone} onChange={set('phone')} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream/40 text-xs mb-1 block">Participants</label>
              <input type="number" min="1" max="20" value={form.participants} onChange={set('participants')} className="input-field" />
            </div>
            <div>
              <label className="text-cream/40 text-xs mb-1 block">Trek Date</label>
              <input type="date" required value={form.trek_date} onChange={set('trek_date')} className="input-field" />
            </div>
          </div>
          <textarea placeholder="Special requests (optional)" value={form.special_requests} onChange={set('special_requests')} rows={3} className="input-field resize-none" />
          {state.error && <p className="text-red-400 text-xs">{state.error}</p>}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <div className="text-cream/60 text-sm">Total: <span className="text-cream font-600">₹{Number(total).toLocaleString('en-IN')}</span></div>
            <button type="submit" disabled={state.loading} className="btn-primary">
              {state.loading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function TrekDetailPage() {
  const { slug } = useParams()
  const [trek, setTrek] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [openDay, setOpenDay] = useState(0)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get(`/treks/${slug}`).then(res => {
      if (res.success) setTrek(res.data)
    }).finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  )

  if (!trek) return (
    <div className="min-h-screen pt-20 flex items-center justify-center text-center">
      <div>
        <h2 className="font-display text-3xl text-cream mb-4">Trek not found</h2>
        <Link to="/treks" className="btn-primary">Browse Treks</Link>
      </div>
    </div>
  )

  const TABS = ['overview', 'itinerary', 'inclusions', 'gallery', 'reviews']
  const allImages = [trek.cover_image, ...(trek.images || []).map(i => i.image_url)].filter(Boolean)

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[70vh] overflow-hidden">
        <img src={trek.cover_image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920'} alt={trek.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-stone-950/30" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-5 lg:px-8 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs px-3 py-1 font-sans ${DIFFICULTY_CLASS[trek.difficulty]}`}>{trek.difficulty}</span>
              <span className="text-cream/50 text-sm">{trek.category}</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-cream font-300 leading-tight mb-3">{trek.name}</h1>
            {trek.tagline && <p className="text-cream/60 text-lg font-sans italic">{trek.tagline}</p>}
          </motion.div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-stone-900/80 backdrop-blur-sm border-b border-white/5 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex overflow-x-auto gap-8 py-4">
            {[
              { label: 'Duration', value: `${trek.duration_days} Days` },
              { label: 'Altitude', value: trek.max_altitude ? `${trek.max_altitude}m` : 'N/A' },
              { label: 'Difficulty', value: trek.difficulty },
              { label: 'Best Season', value: trek.best_season || 'Year-round' },
              { label: 'Group Size', value: `${trek.min_group_size}–${trek.max_group_size}` },
            ].map(item => (
              <div key={item.label} className="flex-shrink-0 text-center">
                <div className="text-cream/40 text-xs uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-cream font-sans text-sm capitalize">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/10 mb-10 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-sans capitalize whitespace-nowrap transition-all border-b-2 -mb-px ${
                    activeTab === tab ? 'border-brand-500 text-brand-400' : 'border-transparent text-cream/50 hover:text-cream'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div>
                  <h2 className="font-display text-3xl text-cream mb-5">Overview</h2>
                  <p className="text-cream/70 font-sans leading-relaxed text-base">{trek.overview}</p>
                </div>

                {trek.highlights?.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl text-cream mb-5">Highlights</h3>
                    <ul className="space-y-3">
                      {trek.highlights.map((h, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3">
                          <span className="text-brand-400 mt-1 flex-shrink-0">✦</span>
                          <span className="text-cream/70 text-sm font-sans">{h}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Itinerary */}
            {activeTab === 'itinerary' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-3xl text-cream mb-8">Day-wise Itinerary</h2>
                <div className="space-y-3">
                  {trek.itinerary?.map((day, i) => (
                    <div key={i} className="border border-white/10 overflow-hidden">
                      <button
                        onClick={() => setOpenDay(openDay === i ? -1 : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-brand-400 font-sans text-sm w-14 flex-shrink-0">Day {day.day_number}</span>
                          <span className="text-cream font-sans font-500">{day.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-cream/40 text-xs flex-shrink-0">
                          {day.altitude && <span>{day.altitude}m</span>}
                          {day.distance && <span>{day.distance}km</span>}
                          <svg className={`w-4 h-4 transition-transform ${openDay === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      <AnimatePresence>
                        {openDay === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-white/5">
                              <p className="text-cream/60 text-sm font-sans leading-relaxed mt-4">{day.description}</p>
                              <div className="flex gap-6 mt-4 text-xs text-cream/40">
                                {day.stay && <span>🏠 {day.stay}</span>}
                                {day.meals && <span>🍽 {day.meals}</span>}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inclusions */}
            {activeTab === 'inclusions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h2 className="font-display text-2xl text-cream mb-5 flex items-center gap-2">
                    <span className="text-forest-400">✓</span> Inclusions
                  </h2>
                  <ul className="space-y-3">
                    {trek.inclusions?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/70 text-sm font-sans">
                        <span className="text-forest-400 mt-0.5 flex-shrink-0">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-2xl text-cream mb-5 flex items-center gap-2">
                    <span className="text-red-400">✕</span> Exclusions
                  </h2>
                  <ul className="space-y-3">
                    {trek.exclusions?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/70 text-sm font-sans">
                        <span className="text-red-400/70 mt-0.5 flex-shrink-0">✕</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {activeTab === 'gallery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-3xl text-cream mb-8">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.map((img, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setLightbox(i)}
                      className="aspect-square overflow-hidden group"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display text-3xl text-cream mb-8">Reviews</h2>
                {trek.reviews?.length ? (
                  <div className="space-y-6">
                    {trek.reviews.map((rv, i) => (
                      <div key={i} className="border border-white/10 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-sans text-cream font-500">{rv.reviewer_name}</div>
                            {rv.title && <div className="text-cream/50 text-sm">{rv.title}</div>}
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: rv.rating }).map((_, j) => (
                              <svg key={j} className="w-4 h-4 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-cream/60 text-sm font-sans leading-relaxed">{rv.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-cream/40 text-sm">No reviews yet. Be the first to review!</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Right sidebar - Booking */}
          <div>
            <BookingForm trek={trek} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={allImages[lightbox]}
              alt=""
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-cream/60 hover:text-cream text-3xl">✕</button>
            <button onClick={() => setLightbox(l => (l - 1 + allImages.length) % allImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream text-3xl p-2">‹</button>
            <button onClick={() => setLightbox(l => (l + 1) % allImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream text-3xl p-2">›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
