import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-stone-950/80" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center px-5"
      >
        <p className="section-tag mb-4">Lost in the Mountains</p>
        <h1 className="font-display text-[10rem] leading-none text-cream/10 font-300 select-none">404</h1>
        <h2 className="font-display text-4xl text-cream font-300 -mt-8 mb-4">Trail Not Found</h2>
        <p className="text-cream/50 font-sans max-w-sm mx-auto mb-8">
          Looks like this path leads nowhere. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/treks" className="btn-outline">Explore Treks</Link>
        </div>
      </motion.div>
    </div>
  )
}
