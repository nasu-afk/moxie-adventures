import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import TrekCard from '../components/common/TrekCard'

// Hero images
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80',
]

const ACTIVITIES = [
  {
    title: 'Trekking',
    desc: 'Himalayan ridges to Sahyadri trails',
    img: 'https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=800',
    to: '/treks?category=trekking',
    color: 'from-forest-900/70'
  },
  {
    title: 'Camping',
    desc: 'Sleep under a sky full of stars',
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    to: '/camping',
    color: 'from-stone-900/70'
  },
  {
    title: 'Stargazing',
    desc: 'Witness the Milky Way in its glory',
    img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800',
    to: '/stargazing',
    color: 'from-indigo-900/70'
  },
  {
    title: 'Spiritual Yatras',
    desc: 'Sacred journeys for the soul',
    img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
    to: '/treks?category=yatra',
    color: 'from-amber-900/70'
  },
  {
    title: 'Expeditions',
    desc: 'High-altitude challenges for the bold',
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    to: '/treks?category=expedition',
    color: 'from-red-900/70'
  },
  {
    title: 'Outdoor Events',
    desc: 'Community experiences in the wild',
    img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=800',
    to: '/events',
    color: 'from-teal-900/70'
  },
]

function HeroSection() {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
      {/* Background images */}
      {HERO_IMAGES.map((img, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1.05 : 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <motion.div style={{ y }} className="h-[120%] w-full -mt-[10%]">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>
      ))}

      {/* Gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-stone-950/20" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pb-20 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="section-tag mb-4"
        >
          Welcome to Moxie Adventures
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl text-cream font-300 leading-[0.95] mb-6 max-w-4xl"
        >
          Adventure
          <br />
          <span className="italic text-brand-400">is Calling</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-cream/60 font-sans text-base md:text-lg max-w-xl mb-8 leading-relaxed"
        >
          From Himalayan summits to Sahyadri forests — immersive treks, soulful yatras, and starlit camps. Your next chapter begins here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4"
        >
          <Link to="/treks" className="btn-primary">
            Explore Treks
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link to="/events" className="btn-outline">
            Upcoming Events
          </Link>
        </motion.div>

        {/* Image dots */}
        <div className="flex gap-2 mt-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-px transition-all duration-300 ${i === current ? 'w-10 bg-brand-400' : 'w-4 bg-cream/25'}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
      >
        <span className="text-cream/30 text-xs tracking-[0.2em] uppercase writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-cream/30 to-transparent">
          <motion.div
            animate={{ y: [0, 40], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-6 bg-brand-400"
          />
        </div>
      </motion.div>
    </section>
  )
}

function ActivitiesSection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="section-tag mb-3">What We Offer</p>
          <h2 className="section-title text-4xl md:text-5xl">Our Adventures</h2>
        </div>
        <Link to="/treks" className="text-brand-400 text-sm uppercase tracking-wider hover:text-brand-300 flex items-center gap-2 transition-colors">
          View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ACTIVITIES.map((act, i) => (
          <motion.div
            key={act.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative group overflow-hidden cursor-pointer ${i === 0 || i === 5 ? 'col-span-2 md:col-span-1' : ''}`}
            style={{ height: i === 0 ? '400px' : '240px' }}
          >
            <Link to={act.to} className="block h-full">
              <img
                src={act.img}
                alt={act.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${act.color} to-transparent`} />
              <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="font-display text-2xl text-cream font-400 mb-1">{act.title}</h3>
                <p className="text-cream/60 text-xs font-sans group-hover:text-cream/80 transition-colors">{act.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function EventsSection({ events }) {
  const [view, setView] = useState('grid')

  if (!events.length) return null

  return (
    <section className="py-24 bg-stone-900/30">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-tag mb-3">Don't Miss Out</p>
            <h2 className="section-title text-4xl md:text-5xl">Upcoming Events</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('grid')} className={`btn-ghost text-xs ${view === 'grid' ? 'text-cream' : ''}`}>
              Grid
            </button>
            <button onClick={() => setView('list')} className={`btn-ghost text-xs ${view === 'list' ? 'text-cream' : ''}`}>
              List
            </button>
            <Link to="/events" className="text-brand-400 text-sm uppercase tracking-wider hover:text-brand-300 flex items-center gap-2 transition-colors">
              All Events
            </Link>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.slice(0, 6).map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group border border-white/5 hover:border-brand-500/30 bg-stone-900/50 transition-colors duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={ev.cover_image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'}
                    alt={ev.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-brand-500 text-white text-xs px-3 py-1 font-sans">
                      {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-cream font-400 mb-2 group-hover:text-brand-300 transition-colors">{ev.name}</h3>
                  <div className="flex items-center gap-1 text-cream/50 text-xs mb-4">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    {ev.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans text-lg text-cream">₹{Number(ev.price).toLocaleString('en-IN')}</span>
                      <span className="text-cream/40 text-xs ml-1">/ person</span>
                    </div>
                    <Link to={`/events/${ev.slug}`} className="btn-primary text-xs py-2 px-4">Register</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 8).map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between gap-6 p-5 border border-white/5 hover:border-brand-500/20 bg-stone-900/30 group transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 text-center">
                    <div className="font-display text-2xl text-brand-400">{new Date(ev.event_date).getDate()}</div>
                    <div className="text-cream/40 text-xs uppercase">{new Date(ev.event_date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div>
                    <h3 className="font-sans text-cream font-500 group-hover:text-brand-300 transition-colors">{ev.name}</h3>
                    <p className="text-cream/50 text-sm">{ev.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-cream font-sans">₹{Number(ev.price).toLocaleString('en-IN')}</span>
                  <Link to={`/events/${ev.slug}`} className="btn-outline text-xs py-2 px-4">Register</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedTreks({ treks }) {
  if (!treks.length) return null
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="section-tag mb-3">Handpicked for You</p>
          <h2 className="section-title text-4xl md:text-5xl">Featured Treks</h2>
        </div>
        <Link to="/treks" className="text-brand-400 text-sm uppercase tracking-wider hover:text-brand-300 flex items-center gap-2 transition-colors">
          All Treks <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks.map((t, i) => <TrekCard key={t.id} trek={t} index={i} />)}
      </div>
    </section>
  )
}

function CommunitySection({ stats }) {
  const STATS = [
    { key: 'treks_completed', label: 'Treks Completed', suffix: '+' },
    { key: 'happy_adventurers', label: 'Happy Adventurers', suffix: '+' },
    { key: 'events_conducted', label: 'Events Conducted', suffix: '+' },
    { key: 'years_of_experience', label: 'Years of Adventure', suffix: '' },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-stone-900/50 to-stone-950">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="section-tag mb-4">The Moxie Community</p>
          <h2 className="section-title text-4xl md:text-6xl max-w-3xl mx-auto">
            Explore Together.<br />
            <span className="italic text-brand-400">Grow Together.</span>
          </h2>
          <p className="text-cream/50 mt-6 max-w-2xl mx-auto font-sans leading-relaxed">
            We're more than an adventure company. We're a community of explorers, dreamers, and seekers who believe the outdoors heals, inspires, and connects us to what truly matters.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {STATS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 border border-white/5 bg-stone-900/30"
            >
              <div className="font-display text-5xl text-brand-400 font-300 mb-2">
                {stats[s.key] ? Number(stats[s.key]).toLocaleString('en-IN') : '—'}{s.suffix}
              </div>
              <div className="text-cream/50 text-sm tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Community image grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
            'https://images.unsplash.com/photo-1475724017904-b712052bb7c0?w=400',
            'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=400',
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square overflow-hidden"
            >
              <img src={img} alt="Community" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy"/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection({ reviews }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!reviews.length) return
    const t = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 4000)
    return () => clearInterval(t)
  }, [reviews])

  if (!reviews.length) return null

  return (
    <section className="py-24 bg-stone-900/20">
      <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <p className="section-tag mb-6">Stories from the Trail</p>
        <div className="relative min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-center gap-1 text-brand-400">
                {Array.from({ length: reviews[current]?.rating || 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <blockquote className="font-display text-2xl md:text-3xl text-cream font-300 italic leading-relaxed max-w-3xl">
                "{reviews[current]?.body}"
              </blockquote>
              <div>
                <div className="font-sans text-cream font-500">{reviews[current]?.reviewer_name}</div>
                {reviews[current]?.title && (
                  <div className="text-brand-400 text-sm">{reviews[current]?.title}</div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-brand-400' : 'bg-cream/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryPreview() {
  const PHOTOS = [
    { img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600', cat: 'Fireflies' },
    { img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600', cat: 'Camping' },
    { img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600', cat: 'Western Ghats' },
    { img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', cat: 'North India' },
    { img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600', cat: 'Stargazing' },
  ]

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-tag mb-3">Visual Stories</p>
            <h2 className="section-title text-4xl md:text-5xl">Gallery</h2>
          </div>
          <Link to="/gallery" className="text-brand-400 text-sm uppercase tracking-wider hover:text-brand-300 flex items-center gap-2 transition-colors">
            View Gallery <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible">
          {PHOTOS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group overflow-hidden flex-shrink-0 w-48 md:w-auto aspect-[3/4]"
            >
              <img src={p.img} alt={p.cat} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"/>
              <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/40 transition-all duration-300 flex items-end p-4">
                <span className="text-cream opacity-0 group-hover:opacity-100 transition-opacity text-sm font-sans">{p.cat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [data, setData] = useState({ events: [], treks: [], reviews: [], stats: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/events?featured=true'),
      api.get('/treks?featured=true&limit=6'),
      api.get('/reviews?featured=true'),
      api.get('/stats')
    ]).then(([ev, tr, rv, st]) => {
      setData({
        events: ev.data || [],
        treks: tr.data || [],
        reviews: rv.data || [],
        stats: st.data || {}
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="noise-overlay" />
      <HeroSection />
      <ActivitiesSection />
      <EventsSection events={data.events} />
      <FeaturedTreks treks={data.treks} />
      <CommunitySection stats={data.stats} />
      <GalleryPreview />
      <TestimonialsSection reviews={data.reviews} />
    </motion.div>
  )
}
