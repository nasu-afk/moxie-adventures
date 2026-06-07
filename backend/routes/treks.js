const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authAdmin } = require('../middleware/auth');

// GET all treks with filters
router.get('/', async (req, res) => {
  try {
    const { category, zone, difficulty, featured, search, page = 1, limit = 12 } = req.query;
    let where = ['t.is_active = 1'];
    let params = [];
    if (category) { where.push('t.category = ?'); params.push(category); }
    if (zone) { where.push('t.zone = ?'); params.push(zone); }
    if (difficulty) { where.push('t.difficulty = ?'); params.push(difficulty); }
    if (featured === 'true') { where.push('t.is_featured = 1'); }
    if (search) { where.push('t.name LIKE ?'); params.push('%' + search + '%'); }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sql = `SELECT t.*, (SELECT image_url FROM trek_images WHERE trek_id = t.id ORDER BY sort_order LIMIT 1) as gallery_thumb FROM treks t WHERE ${where.join(' AND ')} ORDER BY t.is_featured DESC, t.created_at DESC LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM treks t WHERE ${where.join(' AND ')}`;
    const [treks] = await db.execute(sql, [...params, parseInt(limit), offset]);
    const [countResult] = await db.execute(countSql, params);
    res.json({ success: true, data: treks, total: countResult[0].total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single trek by slug
router.get('/:slug', async (req, res) => {
  try {
    const [treks] = await db.execute('SELECT * FROM treks WHERE slug = ? AND is_active = 1', [req.params.slug]);
    if (!treks.length) return res.status(404).json({ success: false, message: 'Trek not found' });
    const trek = treks[0];
    const [images] = await db.execute('SELECT * FROM trek_images WHERE trek_id = ? ORDER BY sort_order', [trek.id]);
    const [itinerary] = await db.execute('SELECT * FROM trek_itineraries WHERE trek_id = ? ORDER BY day_number', [trek.id]);
    const [reviews] = await db.execute('SELECT * FROM reviews WHERE trek_id = ? AND is_approved = 1 ORDER BY created_at DESC LIMIT 10', [trek.id]);
    trek.images = images;
    trek.itinerary = itinerary;
    trek.reviews = reviews;
    ['highlights', 'inclusions', 'exclusions', 'things_to_carry'].forEach(key => {
      if (trek[key] && typeof trek[key] === 'string') {
        try { trek[key] = JSON.parse(trek[key]); } catch {}
      }
    });
    res.json({ success: true, data: trek });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST book a trek
router.post('/:id/book', async (req, res) => {
  try {
    const { name, email, phone, participants, trek_date, special_requests } = req.body;
    if (!name || !email || !phone || !participants || !trek_date) return res.status(400).json({ success: false, message: 'All fields required' });
    const [treks] = await db.execute('SELECT * FROM treks WHERE id = ?', [req.params.id]);
    if (!treks.length) return res.status(404).json({ success: false, message: 'Trek not found' });
    const trek = treks[0];
    const total = trek.price_per_person * parseInt(participants);
    const ref = 'MX' + Date.now().toString().slice(-8);
    await db.execute(
      'INSERT INTO trek_bookings (booking_ref, trek_id, name, email, phone, participants, trek_date, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ref, trek.id, name, email, phone, participants, trek_date, total]
    );
    res.status(201).json({ success: true, message: 'Booking request received', booking_ref: ref, total_amount: total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: Create trek
router.post('/', authAdmin, async (req, res) => {
  try {
    const { slug, name, tagline, category, zone, difficulty, duration_days, max_altitude, best_season, price_per_person, original_price, overview, highlights, inclusions, exclusions, cover_image, is_featured } = req.body;
    const [result] = await db.execute(
      'INSERT INTO treks (slug, name, tagline, category, zone, difficulty, duration_days, max_altitude, best_season, price_per_person, original_price, overview, highlights, inclusions, exclusions, cover_image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [slug, name, tagline, category, zone, difficulty, duration_days, max_altitude, best_season, price_per_person, original_price, overview, JSON.stringify(highlights), JSON.stringify(inclusions), JSON.stringify(exclusions), cover_image, is_featured ? 1 : 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: Update trek
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const { name, tagline, category, zone, difficulty, duration_days, max_altitude, best_season, price_per_person, original_price, overview, highlights, inclusions, exclusions, cover_image, is_featured, is_active } = req.body;
    await db.execute(
      'UPDATE treks SET name=?, tagline=?, category=?, zone=?, difficulty=?, duration_days=?, max_altitude=?, best_season=?, price_per_person=?, original_price=?, overview=?, highlights=?, inclusions=?, exclusions=?, cover_image=?, is_featured=?, is_active=? WHERE id=?',
      [name, tagline, category, zone, difficulty, duration_days, max_altitude, best_season, price_per_person, original_price, overview, JSON.stringify(highlights), JSON.stringify(inclusions), JSON.stringify(exclusions), cover_image, is_featured ? 1 : 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Trek updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: Delete trek
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await db.execute('UPDATE treks SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Trek deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
