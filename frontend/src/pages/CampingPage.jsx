import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import TrekCard from '../components/common/TrekCard'

const PACKAGES = [
  { title: 'Weekend Base Camp', desc: 'A 2-night escape into the forest. Perfect for first-timers looking for a warm introduction to camping.', price: '₹2,499', duration: '2 Days / 1 Night', features: ['Tent accommodation', 'Bonfire & BBQ', 'Breakfast & Dinner', 'Nature walk'] },
  { title: 'Riverside Camping', desc: 'Camp on the banks of a crystal-clear river. Wake up to the sound of flowing water in pristine Sahyadri valleys.', price: '₹3,499', duration: '2 Days / 2 Nights', features: ['Riverside tents', 'Kayaking session', 'All meals', 'Campfire stories'] },
  { title: 'Hilltop Starcamp', desc: 'Our most popular package — camp on a hilltop with panoramic views and a spectacular stargazing experience.', price: '₹3,999', duration: '3 Days / 2 Nights', features: ['Hilltop premium tents', 'Telescope stargazing', 'All meals', 'Sunrise photography'] },
]

const EQUIPMENT = [
  { name: 'Dome Tents', desc: '4-season waterproof tents with sleeping bags rated for 0°C.' },
  { name: 'Sleeping Bags', desc: 'Premium mummy-style sleeping bags, down-filled and lightweight.' },
  { name: 'Camping Stoves', desc: 'Professional-grade gas stoves for reliable cooking in all conditions.' },
  { name: 'First Aid Kit', desc: 'Comprehensive medical kit with trained guide on every camp.' },
  { name: 'Headlamps', desc: 'High-lumen rechargeable headlamps for night trekking and camp activities.' },
  { name: 'Trekking Poles', desc: 'Lightweight adjustable poles available for all campers.' },
]

export default function CampingPage() {
  const [campTrips, setCampTrips] = useState([])

  useEffect(() => {
    api.get('/treks?category=camping&limit=6').then(res => setCampTrips(res.data || []))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Immersive Hero */}
      <div className="relative h-screen flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=90" alt="Camping" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-stone-950/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pb-20 w-full">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="section-tag mb-4">
            Sleep Under the Stars
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            className="font-display text-6xl md:text-8xl text-cream font-300 leading-tight mb-6">
            Wild Camping<br /><span className="italic text-moxie-400">Redefined</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-cream/60 text-lg max-w-xl mb-8 font-sans leading-relaxed">
            Escape the noise. Find your rhythm in the wilderness. Our curated camping experiences combine comfort, adventure, and a deep connection with nature.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-wrap gap-4">
            <a href="#packages" className="btn-primary">View Packages</a>
            <Link to="/events?category=camping" className="btn-outline">Upcoming Camp Events</Link>
          </motion.div>
        </div>
      </div>

      {/* Packages */}
      <section id="packages" className="py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-tag mb-3">Choose Your Experience</p>
            <h2 className="section-title text-4xl md:text-5xl">Camping Packages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border border-white/10 hover:border-moxie-400/40 bg-stone-900/30 p-7 group transition-all duration-300 hover:-translate-y-1">
                <div className="text-moxie-400 text-2xl mb-4">⛺</div>
                <h3 className="font-display text-2xl text-cream mb-2">{pkg.title}</h3>
                <p className="text-cream/50 text-sm font-sans mb-5 leading-relaxed">{pkg.desc}</p>
                <div className="text-cream/40 text-xs mb-4">⏱ {pkg.duration}</div>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="text-cream/60 text-sm flex items-center gap-2">
                      <span className="text-forest-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="font-display text-2xl text-cream">{pkg.price}</span>
                  <Link to="/events?category=camping" className="btn-primary text-xs py-2 px-4">Book Now</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Equipment */}
      <section className="py-24 bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-tag mb-3">Safety First</p>
              <h2 className="section-title text-4xl mb-6">Safety Information</h2>
              <div className="space-y-5 text-cream/60 text-sm font-sans leading-relaxed">
                <p>All our camping experiences are led by certified trek leaders with Wilderness First Aid training. Safety is our top priority on every expedition.</p>
                <p>Every camp site is carefully scouted and approved for safety. We maintain strict protocols for weather conditions and will reschedule if conditions are unsafe.</p>
                <p>All participants receive a pre-trip briefing covering safety protocols, emergency procedures, and environmental guidelines. Leave No Trace principles are mandatory.</p>
                <p>We carry satellite communication devices on all remote camps and have established emergency evacuation protocols for every location.</p>
              </div>
            </div>
            <div>
              <p className="section-tag mb-3">What We Provide</p>
              <h2 className="section-title text-4xl mb-6">Equipment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EQUIPMENT.map((eq, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="p-4 border border-white/5 bg-stone-900/50">
                    <h4 className="font-sans text-cream font-500 text-sm mb-1">{eq.name}</h4>
                    <p className="text-cream/40 text-xs leading-relaxed">{eq.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Camping Trips */}
      {campTrips.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-tag mb-3">All Camping Trips</p>
                <h2 className="section-title text-4xl md:text-5xl">Book a Camp</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campTrips.map((t, i) => <TrekCard key={t.id} trek={t} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-stone-900 to-stone-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-6">Ready to Disconnect?</h2>
          <p className="text-cream/50 font-sans mb-8 leading-relaxed">Leave behind the screens, the schedules, and the stress. The wilderness is waiting to reconnect you to what matters.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/events?category=camping" className="btn-primary">Find a Camp</Link>
            <Link to="/contact" className="btn-outline">Custom Camp Enquiry</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
