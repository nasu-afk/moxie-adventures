import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import TrekCard from '../components/common/TrekCard'

const CATEGORIES = ['all', 'trekking', 'camping', 'stargazing', 'yatra', 'expedition']
const DIFFICULTIES = ['all', 'easy', 'moderate', 'difficult', 'extreme']
const ZONES = ['all', 'north', 'west', 'south', 'east', 'central']

export default function TreksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [treks, setTreks] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const category = searchParams.get('category') || 'all'
  const difficulty = searchParams.get('difficulty') || 'all'
  const zone = searchParams.get('zone') || 'all'

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val === 'all') p.delete(key)
    else p.set(key, val)
    setSearchParams(p)
    setPage(1)
  }

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (difficulty !== 'all') params.set('difficulty', difficulty)
    if (zone !== 'all') params.set('zone', zone)
    if (search) params.set('search', search)
    params.set('page', page)
    params.set('limit', 12)
    api.get('/treks?' + params.toString()).then(res => {
      setTreks(res.data || [])
      setTotal(res.total || 0)
    }).finally(() => setLoading(false))
  }, [category, difficulty, zone, search, page])

  const FilterBtn = ({ value, current, onSelect, label }) => (
    <button
      onClick={() => onSelect(value)}
      className={`px-4 py-2 text-xs uppercase tracking-wider font-sans border transition-all duration-200 ${
        current === value
          ? 'bg-moxie-400 border-moxie-400 text-white'
          : 'border-white/10 text-cream/50 hover:border-white/30 hover:text-cream'
      }`}
    >
      {label || value}
    </button>
  )

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=1920"
          alt="Treks"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="section-tag mb-3">Adventure Awaits</p>
          <h1 className="font-display text-5xl md:text-6xl text-cream font-300">
            All <span className="italic text-moxie-400">Adventures</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {/* Search + Filters */}
        <div className="mb-10 space-y-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search treks, destinations..."
            className="input-field max-w-lg"
          />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-cream/30 text-xs uppercase tracking-wider self-center w-20">Category</span>
              {CATEGORIES.map(c => <FilterBtn key={c} value={c} current={category} onSelect={v => setFilter('category', v)} />)}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-cream/30 text-xs uppercase tracking-wider self-center w-20">Difficulty</span>
              {DIFFICULTIES.map(d => <FilterBtn key={d} value={d} current={difficulty} onSelect={v => setFilter('difficulty', v)} />)}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-cream/30 text-xs uppercase tracking-wider self-center w-20">Zone</span>
              {ZONES.map(z => <FilterBtn key={z} value={z} current={zone} onSelect={v => setFilter('zone', v)} />)}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-cream/40 text-sm">{total} adventure{total !== 1 ? 's' : ''} found</p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-stone-900/50 animate-pulse" />
            ))}
          </div>
        ) : treks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treks.map((t, i) => <TrekCard key={t.id} trek={t} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-cream/40">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="font-display text-2xl">No adventures found</p>
            <p className="text-sm mt-2">Try different filters</p>
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex justify-center gap-3 mt-12">
            {page > 1 && (
              <button onClick={() => setPage(p => p - 1)} className="btn-outline text-sm py-2 px-5">Previous</button>
            )}
            {treks.length === 12 && (
              <button onClick={() => setPage(p => p + 1)} className="btn-primary text-sm py-2 px-5">Load More</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
