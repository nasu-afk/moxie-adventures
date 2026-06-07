import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const DIFFICULTY_CLASS = {
  easy: 'difficulty-easy',
  moderate: 'difficulty-moderate',
  difficult: 'difficulty-difficult',
  extreme: 'difficulty-extreme'
}

const CATEGORY_ICON = {
  trekking: '⛰',
  camping: '⛺',
  stargazing: '✦',
  yatra: '🕉',
  expedition: '🧭',
  event: '📍'
}

export default function TrekCard({ trek, index = 0 }) {
  const img = trek.cover_image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
  const discount = trek.original_price && trek.original_price > trek.price_per_person
    ? Math.round((1 - trek.price_per_person / trek.original_price) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link to={`/treks/${trek.slug}`} className="card-adventure block group">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-stone-900">
          <img
            src={img}
            alt={trek.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5">
            <span className="bg-stone-950/70 backdrop-blur-sm px-2.5 py-1 text-xs text-cream/70 border border-white/10 font-sans">
              {CATEGORY_ICON[trek.category]} {trek.category}
            </span>
          </div>

          {/* Discount */}
          {discount && (
            <div className="absolute top-4 right-4 bg-brand-500 text-white px-2 py-1 text-xs font-sans font-600">
              {discount}% OFF
            </div>
          )}

          {/* Zone */}
          <div className="absolute bottom-4 left-4">
            <span className="text-cream/50 text-xs uppercase tracking-wider">{trek.zone} Zone</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-stone-900/50 border border-white/5 border-t-0 p-5 group-hover:border-brand-500/20 transition-colors duration-300">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display text-xl text-cream font-400 leading-tight group-hover:text-brand-300 transition-colors">
              {trek.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 font-sans whitespace-nowrap mt-0.5 ${DIFFICULTY_CLASS[trek.difficulty] || 'difficulty-moderate'}`}>
              {trek.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4 text-cream/50 text-xs font-sans mb-4">
            <span>{trek.duration_days} days</span>
            {trek.max_altitude && <span>{trek.max_altitude}m alt.</span>}
            {trek.best_season && <span>{trek.best_season}</span>}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-lg text-cream font-500">
                  ₹{Number(trek.price_per_person).toLocaleString('en-IN')}
                </span>
                <span className="text-cream/30 text-xs">/ person</span>
              </div>
              {trek.original_price && trek.original_price > trek.price_per_person && (
                <span className="text-cream/30 text-xs line-through">
                  ₹{Number(trek.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-brand-400 text-xs uppercase tracking-wider font-sans group-hover:gap-2 transition-all flex items-center gap-1">
              Explore
              <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
