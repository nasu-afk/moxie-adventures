import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'

const VALUES = [
  { icon: '🌿', title: 'Eco-Conscious', desc: 'We practice Leave No Trace principles on every expedition and actively support local conservation efforts.' },
  { icon: '🛡', title: 'Safety First', desc: 'Every leader is trained in Wilderness First Aid. Safety protocols are non-negotiable on every trip.' },
  { icon: '🤝', title: 'Community', desc: 'We build genuine connections — between people, and between humans and the natural world.' },
  { icon: '✦', title: 'Excellence', desc: 'From logistics to guides to food, we obsess over the details to deliver extraordinary experiences.' },
]

export default function AboutPage() {
  const [team, setTeam] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    api.get('/team').then(res => setTeam(res.data || []))
    api.get('/stats').then(res => setStats(res.data || {}))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[80vh] flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=1920&q=90" alt="About Moxie Adventures" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-stone-950/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pb-16 w-full">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="section-tag mb-4">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            className="font-display text-5xl md:text-7xl text-cream font-300 leading-tight mb-6 max-w-3xl">
            Adventure<br /><span className="italic text-moxie-400">is Calling</span>
          </motion.h1>
        </div>
      </div>

      {/* Intro */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-cream/70 font-sans text-lg leading-relaxed mb-6">
                Adventure is calling and Moxie Adventures is here to take you beyond the ordinary. From thrilling treks and peaceful camping nights to soulful spiritual yatras and unforgettable expeditions, we are building a community for people who live to explore.
              </p>
              <p className="text-cream/60 font-sans leading-relaxed mb-6">
                This is more than travel. This is about experiences, stories, growth, and discovering the world one adventure at a time. Every trail we walk, every summit we reach, every starlit night we share — it all adds up to a life fully lived.
              </p>
              <p className="font-display text-2xl text-moxie-400 italic">Let's explore. Let's grow.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: stats.treks_completed || '500', label: 'Treks Completed', suffix: '+' },
                { value: stats.happy_adventurers || '8000', label: 'Happy Adventurers', suffix: '+' },
                { value: stats.events_conducted || '120', label: 'Events Conducted', suffix: '+' },
                { value: stats.years_of_experience || '5', label: 'Years of Adventure', suffix: '' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-6 border border-white/10 bg-stone-900/30 text-center">
                  <div className="font-display text-4xl text-moxie-400 font-300 mb-1">
                    {Number(s.value).toLocaleString('en-IN')}{s.suffix}
                  </div>
                  <div className="text-cream/40 text-xs">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="p-8 border border-moxie-400/20 bg-moxie-400/5">
              <div className="text-moxie-400 text-3xl mb-4">◈</div>
              <h2 className="font-display text-3xl text-cream mb-5">Our Vision</h2>
              <p className="text-cream/60 font-sans leading-relaxed">
                To cultivate a world where people rekindle their connection with nature, discover inner peace and nurture healthier mind, body and soul through unforgettable outdoor adventure.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
              className="p-8 border border-forest-500/20 bg-forest-500/5">
              <div className="text-forest-400 text-3xl mb-4">◈</div>
              <h2 className="font-display text-3xl text-cream mb-5">Our Mission</h2>
              <p className="text-cream/60 font-sans leading-relaxed">
                Our mission is to provide safe, exhilarating, and eco-conscious adventure and spiritual experiences that rejuvenate the mind, strengthen the body, and foster a deeper appreciation for nature through activities like trekking, wilderness exploration and spiritual journeys.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-tag mb-3">What We Stand For</p>
            <h2 className="section-title text-4xl md:text-5xl">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 border border-white/5 hover:border-moxie-400/30 bg-stone-900/20 transition-all group">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-sans text-cream font-500 mb-2 group-hover:text-moxie-300 transition-colors">{v.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-tag mb-3">The People Behind Moxie</p>
            <h2 className="section-title text-4xl md:text-5xl">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(team.length === 0 ? [
              {
                name: 'Krishna Khushwaha', designation: 'Founder',
                bio: 'Krishna is a passionate adventurer and entrepreneur who founded Moxie Adventures to share his love for the outdoors with the world. With over a decade of trekking experience across the Himalayas and Western Ghats, he brings deep expertise and genuine passion to every expedition.',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                instagram: '#', linkedin: '#'
              },
              {
                name: 'Hiral Sampat', designation: 'Managing Director',
                bio: 'Hiral brings her sharp business acumen and love for travel to Moxie Adventures. As Managing Director, she oversees operations, partnerships, and community building, ensuring every adventure is seamless, safe, and unforgettable.',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                instagram: '#', linkedin: '#'
              }
            ] : team).map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group">
                <div className="aspect-square overflow-hidden mb-5 relative">
                  <img
                    src={member.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400`}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                  {/* Social links overlay */}
                  <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 bg-stone-950/80 flex items-center justify-center text-cream/70 hover:text-cream transition-colors text-xs">in</a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 bg-stone-950/80 flex items-center justify-center text-cream/70 hover:text-cream transition-colors text-xs">li</a>
                    )}
                  </div>
                </div>
                <h3 className="font-display text-2xl text-cream font-400 mb-1">{member.name}</h3>
                <p className="text-moxie-400 text-sm font-sans mb-3">{member.designation}</p>
                <p className="text-cream/50 text-sm font-sans leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
