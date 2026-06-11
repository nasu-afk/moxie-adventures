import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'fireflies', label: 'Fireflies' },
  { key: 'camping', label: 'Camping' },
  { key: 'western_ghats', label: 'Western Ghats' },
  { key: 'north_india', label: 'North India' },
  { key: 'treks', label: 'Treks' },
  { key: 'stargazing', label: 'Stargazing' },
]

function LazyImage({ src, alt, onClick, className }) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold: 0.1, rootMargin: '200px' })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden cursor-pointer ${className}`} onClick={onClick}>
      {!loaded && <div className="absolute inset-0 bg-stone-900 animate-pulse" />}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get(`/gallery${cat !== 'all' ? `?category=${cat}` : ''}`).then(res => setImages(res.data || [])).finally(() => setLoading(false))
  }, [cat])

  const current = images[lightbox]
  const prev = () => setLightbox(l => (l - 1 + images.length) % images.length)
  const next = () => setLightbox(l => (l + 1) % images.length)

  useEffect(() => {
    const handler = e => {
      if (lightbox === null) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, images.length])

  // Build masonry columns
  const cols = [[], [], []]
  images.forEach((img, i) => cols[i % 3].push({ ...img, idx: i }))

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920" alt="Gallery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-950/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-tag mb-3">Visual Stories</p>
          <h1 className="font-display text-5xl md:text-6xl text-cream font-300">
            Our <span className="italic text-moxie-400">Gallery</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {CATS.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-sans border transition-all duration-200 ${cat === c.key ? 'bg-moxie-400 border-moxie-400 text-white' : 'border-white/10 text-cream/50 hover:border-white/30 hover:text-cream'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`bg-stone-900/50 animate-pulse ${i % 3 === 0 ? 'h-72' : 'h-48'}`} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24 text-cream/40">
            <p className="font-display text-3xl">No images in this category</p>
          </div>
        ) : (
          <div className="hidden md:flex gap-3">
            {cols.map((col, ci) => (
              <div key={ci} className="flex-1 flex flex-col gap-3">
                {col.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="group overflow-hidden"
                    style={{ height: img.idx % 5 === 0 ? '320px' : img.idx % 3 === 0 ? '250px' : '200px' }}
                  >
                    <LazyImage
                      src={img.image_url}
                      alt={img.title || img.category}
                      onClick={() => setLightbox(img.idx)}
                      className="w-full h-full group"
                    />
                    <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/40 transition-all duration-300 flex items-end p-4 pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {img.title && <p className="text-cream text-sm font-sans">{img.title}</p>}
                        {img.location && <p className="text-cream/60 text-xs">{img.location}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Mobile: single column grid */}
        {!loading && images.length > 0 && (
          <div className="md:hidden grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <motion.div key={img.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="group overflow-hidden aspect-square">
                <LazyImage src={img.image_url} alt={img.title || img.category} onClick={() => setLightbox(i)} className="w-full h-full group" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/97 flex items-center justify-center"
          >
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] mx-4"
            >
              <img src={current.image_url} alt={current.title || ''} className="max-h-[80vh] max-w-full object-contain rounded" />
              {(current.title || current.location) && (
                <div className="mt-3 text-center">
                  {current.title && <p className="text-cream font-sans">{current.title}</p>}
                  {current.location && <p className="text-cream/50 text-sm">{current.location}</p>}
                  {current.captured_by && <p className="text-cream/30 text-xs mt-1">Photo: {current.captured_by}</p>}
                </div>
              )}
            </motion.div>

            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-cream/60 hover:text-cream text-4xl leading-none" aria-label="Close">×</button>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 text-cream/70 hover:text-cream hover:border-white/50 transition-all text-2xl">‹</button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 text-cream/70 hover:text-cream hover:border-white/50 transition-all text-2xl">›</button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream/30 text-sm">{lightbox + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
