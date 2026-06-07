import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [state, setState] = useState({ loading: false, error: '' })
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, error: '' })
    try {
      const res = await api.post('/auth/login', form)
      if (res.success) { loginUser(res); navigate('/') }
      else setState({ loading: false, error: res.message })
    } catch { setState({ loading: false, error: 'Something went wrong' }) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative">
      <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-stone-950/80" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl text-cream">Moxie Adventures</Link>
          <p className="text-cream/40 text-sm mt-2">Sign in to your account</p>
        </div>
        <div className="glass p-8 border border-white/10">
          <form onSubmit={submit} className="space-y-4">
            <input type="email" placeholder="Email Address" required value={form.email} onChange={set('email')} className="input-field" />
            <input type="password" placeholder="Password" required value={form.password} onChange={set('password')} className="input-field" />
            {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
            <button type="submit" disabled={state.loading} className="btn-primary w-full justify-center">
              {state.loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-cream/40 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-brand-400 hover:text-brand-300">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [state, setState] = useState({ loading: false, error: '' })
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setState({ loading: true, error: '' })
    try {
      const res = await api.post('/auth/register', form)
      if (res.success) { loginUser(res); navigate('/') }
      else setState({ loading: false, error: res.message })
    } catch { setState({ loading: false, error: 'Something went wrong' }) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative">
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-stone-950/80" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl text-cream">Moxie Adventures</Link>
          <p className="text-cream/40 text-sm mt-2">Create your adventure account</p>
        </div>
        <div className="glass p-8 border border-white/10">
          <form onSubmit={submit} className="space-y-4">
            <input placeholder="Full Name" required value={form.name} onChange={set('name')} className="input-field" />
            <input type="email" placeholder="Email Address" required value={form.email} onChange={set('email')} className="input-field" />
            <input placeholder="Phone Number" value={form.phone} onChange={set('phone')} className="input-field" />
            <input type="password" placeholder="Password (min. 8 characters)" required value={form.password} onChange={set('password')} className="input-field" minLength={8} />
            {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
            <button type="submit" disabled={state.loading} className="btn-primary w-full justify-center">
              {state.loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-cream/40 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
