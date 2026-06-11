import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [state, setState] = useState({ loading: false, success: '', error: '' })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, success: '', error: '' })
    try {
      const res = await api.post('/contact', form)
      if (res.success) {
        setState({ loading: false, success: res.message, error: '' })
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else setState({ loading: false, success: '', error: res.message })
    } catch { setState({ loading: false, success: '', error: 'Something went wrong. Please try again.' }) }
  }

  const SOCIALS = [
    { name: 'Instagram', href: 'https://instagram.com', label: '@moxieadventures' },
    { name: 'Facebook', href: 'https://facebook.com', label: 'Moxie Adventures' },
    { name: 'YouTube', href: 'https://youtube.com', label: 'Moxie Adventures' },
    { name: 'LinkedIn', href: 'https://linkedin.com', label: 'Moxie Adventures' },
  ]

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920" alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-950/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-tag mb-3">Get In Touch</p>
          <h1 className="font-display text-5xl md:text-6xl text-cream font-300">
            Contact <span className="italic text-moxie-400">Us</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <p className="section-tag mb-4">Reach Us</p>
              <div className="space-y-4 text-cream/60 text-sm font-sans">
                <div className="flex items-start gap-3">
                  <span className="text-moxie-400 text-lg mt-0.5">✉</span>
                  <div>
                    <div className="text-cream/40 text-xs mb-1">Email</div>
                    <a href="mailto:hello@moxieadventures.com" className="hover:text-cream transition-colors">hello@moxieadventures.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-moxie-400 text-lg mt-0.5">☎</span>
                  <div>
                    <div className="text-cream/40 text-xs mb-1">Phone</div>
                    <a href="tel:+919876543210" className="hover:text-cream transition-colors">+91 98765 43210</a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi! I'm interested in booking an adventure with Moxie Adventures."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 border border-forest-500/30 bg-forest-500/5 hover:bg-forest-500/10 transition-colors group"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-forest-400">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <div>
                <div className="text-cream font-sans text-sm font-500 group-hover:text-forest-300 transition-colors">Chat on WhatsApp</div>
                <div className="text-cream/40 text-xs">Quick response guaranteed</div>
              </div>
            </a>

            {/* Social */}
            <div>
              <p className="text-cream/30 text-xs uppercase tracking-wider mb-4">Follow Us</p>
              <div className="space-y-3">
                {SOCIALS.map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between text-sm text-cream/50 hover:text-cream transition-colors group">
                    <span>{s.name}</span>
                    <span className="text-cream/30 group-hover:text-moxie-400 transition-colors text-xs">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl text-cream mb-8">Send us a Message</h2>
            {state.success ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-forest-500/10 border border-forest-500/30 text-forest-300 font-sans">
                <div className="text-2xl mb-2">✓</div>
                {state.success}
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Your Name *" required value={form.name} onChange={set('name')} className="input-field" />
                  <input type="email" placeholder="Email Address *" required value={form.email} onChange={set('email')} className="input-field" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Phone Number" value={form.phone} onChange={set('phone')} className="input-field" />
                  <input placeholder="Subject" value={form.subject} onChange={set('subject')} className="input-field" />
                </div>
                <textarea placeholder="Your Message *" required value={form.message} onChange={set('message')} rows={6} className="input-field resize-none" />
                {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
                <button type="submit" disabled={state.loading} className="btn-primary w-full justify-center">
                  {state.loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}

            {/* Map embed placeholder */}
            <div className="mt-8 h-64 bg-stone-900/50 border border-white/5 flex items-center justify-center overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.6831!2d72.96648!3d19.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEzJzA2LjAiTiA3MsKwNTcnNTkuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                title="Moxie Adventures Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
