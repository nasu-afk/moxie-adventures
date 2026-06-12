import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.alpha += s.speed * s.dir
        if (s.alpha >= 1 || s.alpha <= 0.1) s.dir *= -1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

const LOCATIONS = [
  { name: 'Pawna Lake', state: 'Maharashtra', darkness: '★★★★★', altitude: '600m', bestMonths: 'Oct–Mar', img: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800' },
  { name: 'Igatpuri', state: 'Maharashtra', darkness: '★★★★☆', altitude: '580m', bestMonths: 'Nov–Feb', img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800' },
  { name: 'Rajmachi', state: 'Maharashtra', darkness: '★★★★☆', altitude: '900m', bestMonths: 'Oct–Apr', img: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800' },
  { name: 'Sandakphu', state: 'West Bengal', darkness: '★★★★★', altitude: '3636m', bestMonths: 'Oct–Dec', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800' },
]

const FACTS = [
  { icon: '🌌', title: 'Milky Way Visibility', desc: 'On moonless nights at our dark sky sites, the Milky Way stretches across the entire sky — visible even to the naked eye.' },
  { icon: '🔭', title: 'Professional Telescopes', desc: 'We bring professional-grade 8" and 12" Dobsonian telescopes, allowing you to see Jupiter\'s moons, Saturn\'s rings, and distant nebulae.' },
  { icon: '📸', title: 'Astrophotography', desc: 'Our expert photographers guide you through capturing long-exposure shots of star trails, planets, and deep sky objects.' },
  { icon: '🌙', title: 'New Moon Sessions', desc: 'All our stargazing events are scheduled around new moon phases for maximum darkness and the clearest skies.' },
]

export default function StargazingPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    api.get('/events?category=stargazing').then(res => setEvents(res.data || []))
  }, [])

  return (
    <div className="min-h-screen bg-[#020208]">
      {/* Hero - full screen night sky */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=90" alt="Night Sky" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020208]/60 via-transparent to-[#020208]" />
        <StarField />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-5">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="section-tag mb-6 tracking-[0.5em]">
            Chase the Cosmos
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
            className="font-display text-6xl md:text-8xl text-white font-300 leading-tight mb-6">
            The Universe<br /><span className="italic" style={{ color: '#a78bfa' }}>Awaits You</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-white/50 text-lg font-sans max-w-xl mx-auto mb-10 leading-relaxed">
            Escape to India's darkest skies. Witness the Milky Way, track constellations, and experience the profound silence of the cosmos.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-4 justify-center">
            <a href="#events" className="btn-primary">Book a Stargazing Night</a>
            <a href="#locations" className="btn-outline">View Locations</a>
          </motion.div>
        </div>

        {/* Shooting star animation */}
        <motion.div
          animate={{ x: ['0vw', '60vw'], y: ['0', '40vh'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: 3, repeat: Infinity, repeatDelay: 8 }}
          className="absolute top-[15%] left-[10%] w-20 h-px bg-gradient-to-r from-transparent via-white to-transparent rotate-[30deg]"
        />
      </div>

      {/* About stargazing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-tag mb-4" style={{ color: '#a78bfa' }}>What to Expect</p>
            <h2 className="font-display text-4xl md:text-5xl text-white font-300">A Night Among the Stars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACTS.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 border border-white/10 bg-white/3 hover:border-purple-500/30 transition-colors duration-300 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-sans text-white font-500 mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-24 bg-white/3">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-tag mb-3" style={{ color: '#a78bfa' }}>Dark Sky Sites</p>
            <h2 className="font-display text-4xl md:text-5xl text-white font-300">Our Stargazing Locations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {LOCATIONS.map((loc, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group overflow-hidden border border-white/10 hover:border-purple-500/40 transition-colors duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="font-sans text-white font-500 text-sm">{loc.name}</div>
                    <div className="text-white/50 text-xs">{loc.state}</div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Sky Darkness</span>
                    <span style={{ color: '#a78bfa' }}>{loc.darkness}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Altitude</span>
                    <span className="text-white">{loc.altitude}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Best Months</span>
                    <span className="text-white">{loc.bestMonths}</span>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <Link
                      to="/events?category=stargazing"
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-wider border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-colors duration-200"
                    >
                      Book This Location
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-tag mb-3" style={{ color: '#a78bfa' }}>Don't Miss</p>
              <h2 className="font-display text-4xl md:text-5xl text-white font-300">Upcoming Stargazing Events</h2>
            </div>
            <Link to="/events?category=stargazing" className="text-sm uppercase tracking-wider transition-colors flex items-center gap-2" style={{ color: '#a78bfa' }}>
              All Events <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <p className="font-display text-2xl">No upcoming events</p>
              <p className="text-sm mt-2">Check back soon — new dates added every month!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev, i) => (
                <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="border border-white/10 hover:border-purple-500/30 bg-white/3 p-6 group transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 border text-white/60" style={{ borderColor: '#a78bfa40', color: '#a78bfa' }}>
                      {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-white mb-2 group-hover:text-purple-300 transition-colors">{ev.name}</h3>
                  <p className="text-white/40 text-sm mb-4">📍 {ev.location}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-white font-sans">₹{Number(ev.price).toLocaleString('en-IN')}</span>
                    <Link to={`/events/${ev.slug}`} className="text-xs px-4 py-2 border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-colors uppercase tracking-wider">
                      Register
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
