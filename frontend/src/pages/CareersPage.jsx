import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'

function ApplyModal({ career, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', cover_letter: '' })
  const [state, setState] = useState({ loading: false, success: '', error: '' })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, success: '', error: '' })
    try {
      const res = await api.post(`/careers/${career.id}/apply`, form)
      if (res.success) setState({ loading: false, success: 'Application submitted! We\'ll be in touch soon.', error: '' })
      else setState({ loading: false, success: '', error: res.message })
    } catch { setState({ loading: false, success: '', error: 'Something went wrong. Please try again.' }) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-stone-900 border border-white/10 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display text-2xl text-cream">{career.title}</h3>
            <p className="text-cream/50 text-sm">{career.department} · {career.location}</p>
          </div>
          <button onClick={onClose} className="text-cream/40 hover:text-cream text-2xl leading-none ml-4">×</button>
        </div>
        {state.success ? (
          <div className="p-5 bg-forest-500/10 border border-forest-500/30 text-forest-300 text-sm">
            ✓ {state.success}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input placeholder="Full Name *" required value={form.name} onChange={set('name')} className="input-field" />
            <input type="email" placeholder="Email *" required value={form.email} onChange={set('email')} className="input-field" />
            <input placeholder="Phone" value={form.phone} onChange={set('phone')} className="input-field" />
            <textarea placeholder="Cover Letter — tell us why you'd be a great fit *" required value={form.cover_letter} onChange={set('cover_letter')} rows={5} className="input-field resize-none" />
            {state.error && <p className="text-red-400 text-xs">{state.error}</p>}
            <button type="submit" disabled={state.loading} className="btn-primary w-full justify-center">
              {state.loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

const TYPE_BADGE = {
  full_time: { label: 'Full-time', cls: 'bg-brand-500/15 text-brand-300 border-brand-500/30' },
  part_time: { label: 'Part-time', cls: 'bg-forest-500/15 text-forest-300 border-forest-500/30' },
  internship: { label: 'Internship', cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  volunteer: { label: 'Volunteer', cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
}

export default function CareersPage() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)

  useEffect(() => {
    api.get('/careers').then(res => setCareers(res.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920" alt="Careers" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-950/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-tag mb-3">Join the Team</p>
          <h1 className="font-display text-5xl md:text-6xl text-cream font-300">
            Build a Career<br /><span className="italic text-brand-400">with Purpose</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        {/* Intro */}
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl text-cream mb-4">Work with Us</h2>
          <p className="text-cream/60 font-sans leading-relaxed">
            At Moxie Adventures, we're not just colleagues — we're a tribe of passionate adventurers, storytellers, and changemakers. If you believe in the power of nature to transform lives, we'd love to have you on our team.
          </p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-stone-900/50 animate-pulse" />)}
          </div>
        ) : careers.length === 0 ? (
          <div className="text-center py-24 border border-white/5">
            <p className="font-display text-3xl text-cream/40 mb-2">No open positions right now</p>
            <p className="text-cream/30 text-sm">We're always looking for passionate people. Drop us your CV at hello@moxieadventures.com</p>
          </div>
        ) : (
          <div className="space-y-4">
            {careers.map((job, i) => {
              const badge = TYPE_BADGE[job.type] || TYPE_BADGE.full_time
              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 border border-white/5 hover:border-brand-500/30 bg-stone-900/30 group transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-sans text-cream font-500 text-lg group-hover:text-brand-300 transition-colors">{job.title}</h3>
                        <span className={`text-xs px-2.5 py-0.5 border ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-cream/40 text-sm mb-3">
                        {job.department && <span>🏢 {job.department}</span>}
                        <span>📍 {job.location}</span>
                      </div>
                      <p className="text-cream/60 text-sm font-sans line-clamp-3">{job.description}</p>
                      {job.requirements && (
                        <div className="mt-3">
                          <p className="text-cream/30 text-xs uppercase tracking-wider mb-1">Requirements</p>
                          <p className="text-cream/50 text-xs font-sans">{job.requirements}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <button onClick={() => setApplying(job)} className="btn-primary">Apply Now</button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* General application */}
        <div className="mt-16 p-8 border border-white/5 bg-stone-900/20 text-center">
          <h3 className="font-display text-2xl text-cream mb-3">Don't see your role?</h3>
          <p className="text-cream/50 text-sm font-sans mb-6">We're always keen to meet talented people who share our passion for adventure. Send your CV and a brief note about yourself.</p>
          <a href="mailto:hello@moxieadventures.com?subject=General Application – Moxie Adventures" className="btn-outline">
            Send General Application
          </a>
        </div>
      </div>

      <AnimatePresence>
        {applying && <ApplyModal career={applying} onClose={() => setApplying(null)} />}
      </AnimatePresence>
    </div>
  )
}
