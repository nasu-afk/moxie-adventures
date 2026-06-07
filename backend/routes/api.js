const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authAdmin } = require('../middleware/auth');

// ============================================================
// EVENTS
// ============================================================
router.get('/events', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let where = ['is_active = 1'];
    let params = [];
    if (category) { where.push('category = ?'); params.push(category); }
    if (featured === 'true') { where.push('is_featured = 1'); }
    const [events] = await db.execute(`SELECT * FROM events WHERE ${where.join(' AND ')} ORDER BY event_date ASC`, params);
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/events/:slug', async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM events WHERE slug = ? AND is_active = 1', [req.params.slug]);
    if (!events.length) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: events[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/events/:id/register', async (req, res) => {
  try {
    const { name, email, phone, participants } = req.body;
    const [events] = await db.execute('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!events.length) return res.status(404).json({ success: false, message: 'Event not found' });
    const event = events[0];
    const total = event.price * (parseInt(participants) || 1);
    const ref = 'EV' + Date.now().toString().slice(-8);
    await db.execute(
      'INSERT INTO event_registrations (registration_ref, event_id, name, email, phone, participants, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ref, event.id, name, email, phone, participants || 1, total]
    );
    await db.execute('UPDATE events SET registered_count = registered_count + ? WHERE id = ?', [participants || 1, event.id]);
    res.status(201).json({ success: true, message: 'Registration successful', ref, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// GALLERY
// ============================================================
router.get('/gallery', async (req, res) => {
  try {
    const { category } = req.query;
    let where = ['is_active = 1'];
    let params = [];
    if (category && category !== 'all') { where.push('category = ?'); params.push(category); }
    const [images] = await db.execute(`SELECT * FROM gallery WHERE ${where.join(' AND ')} ORDER BY sort_order ASC, created_at DESC`, params);
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// REVIEWS
// ============================================================
router.get('/reviews', async (req, res) => {
  try {
    const { featured, trek_id } = req.query;
    let where = ['is_approved = 1'];
    let params = [];
    if (featured === 'true') { where.push('is_featured = 1'); }
    if (trek_id) { where.push('trek_id = ?'); params.push(trek_id); }
    const [reviews] = await db.execute(`SELECT * FROM reviews WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT 20`, params);
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { reviewer_name, reviewer_email, trek_id, event_id, rating, title, body } = req.body;
    if (!reviewer_name || !rating || !body) return res.status(400).json({ success: false, message: 'Name, rating and review required' });
    await db.execute(
      'INSERT INTO reviews (reviewer_name, reviewer_email, trek_id, event_id, rating, title, body) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [reviewer_name, reviewer_email, trek_id || null, event_id || null, rating, title, body]
    );
    res.status(201).json({ success: true, message: 'Review submitted, pending approval' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// TEAM
// ============================================================
router.get('/team', async (req, res) => {
  try {
    const [members] = await db.execute('SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// CAREERS
// ============================================================
router.get('/careers', async (req, res) => {
  try {
    const [careers] = await db.execute('SELECT * FROM careers WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: careers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/careers/:id/apply', async (req, res) => {
  try {
    const { name, email, phone, cover_letter } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });
    await db.execute(
      'INSERT INTO career_applications (career_id, name, email, phone, cover_letter) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, name, email, phone, cover_letter]
    );
    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// CONTACT
// ============================================================
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Name, email and message required' });
    await db.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, message]
    );
    res.status(201).json({ success: true, message: 'Message received, we will get back to you shortly!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// NEWSLETTER
// ============================================================
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const [existing] = await db.execute('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    if (existing.length) {
      await db.execute('UPDATE newsletter_subscribers SET is_active = 1, unsubscribed_at = NULL WHERE email = ?', [email]);
      return res.json({ success: true, message: 'You are now subscribed!' });
    }
    await db.execute('INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)', [email, name || null]);
    res.status(201).json({ success: true, message: 'Subscribed successfully! Welcome to the Moxie community.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// STATS
// ============================================================
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await db.execute('SELECT stat_key, stat_value FROM site_stats');
    const result = {};
    stats.forEach(s => { result[s.stat_key] = s.stat_value; });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================

// Admin: Dashboard stats
router.get('/admin/dashboard', authAdmin, async (req, res) => {
  try {
    const [[bookings]] = await db.execute('SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM trek_bookings WHERE status != "cancelled"');
    const [[events]] = await db.execute('SELECT COUNT(*) as total FROM events WHERE event_date >= CURDATE()');
    const [[subscribers]] = await db.execute('SELECT COUNT(*) as total FROM newsletter_subscribers WHERE is_active = 1');
    const [[treks]] = await db.execute('SELECT COUNT(*) as total FROM treks WHERE is_active = 1');
    const [recent_bookings] = await db.execute('SELECT tb.*, t.name as trek_name FROM trek_bookings tb JOIN treks t ON tb.trek_id = t.id ORDER BY tb.created_at DESC LIMIT 10');
    res.json({
      success: true,
      data: {
        total_bookings: bookings.total,
        revenue: bookings.revenue || 0,
        upcoming_events: events.total,
        subscribers: subscribers.total,
        active_treks: treks.total,
        recent_bookings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: All bookings
router.get('/admin/bookings', authAdmin, async (req, res) => {
  try {
    const [bookings] = await db.execute('SELECT tb.*, t.name as trek_name FROM trek_bookings tb JOIN treks t ON tb.trek_id = t.id ORDER BY tb.created_at DESC');
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update booking status
router.put('/admin/bookings/:id', authAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE trek_bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Booking updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Contact messages
router.get('/admin/contacts', authAdmin, async (req, res) => {
  try {
    const [messages] = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Approve review
router.put('/admin/reviews/:id', authAdmin, async (req, res) => {
  try {
    const { is_approved, is_featured } = req.body;
    await db.execute('UPDATE reviews SET is_approved = ?, is_featured = ? WHERE id = ?', [is_approved ? 1 : 0, is_featured ? 1 : 0, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Create event
router.post('/events', authAdmin, async (req, res) => {
  try {
    const { slug, name, tagline, category, description, cover_image, location, event_date, end_date, price, max_participants, is_featured } = req.body;
    const [result] = await db.execute(
      'INSERT INTO events (slug, name, tagline, category, description, cover_image, location, event_date, end_date, price, max_participants, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [slug, name, tagline, category, description, cover_image, location, event_date, end_date, price, max_participants, is_featured ? 1 : 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update event
router.put('/events/:id', authAdmin, async (req, res) => {
  try {
    const { name, tagline, description, location, event_date, end_date, price, max_participants, is_featured, is_active } = req.body;
    await db.execute(
      'UPDATE events SET name=?, tagline=?, description=?, location=?, event_date=?, end_date=?, price=?, max_participants=?, is_featured=?, is_active=? WHERE id=?',
      [name, tagline, description, location, event_date, end_date, price, max_participants, is_featured ? 1 : 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Gallery management
router.post('/gallery', authAdmin, async (req, res) => {
  try {
    const { title, image_url, category, location, captured_by } = req.body;
    const [result] = await db.execute('INSERT INTO gallery (title, image_url, category, location, captured_by) VALUES (?, ?, ?, ?, ?)', [title, image_url, category, location, captured_by]);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/gallery/:id', authAdmin, async (req, res) => {
  try {
    await db.execute('UPDATE gallery SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Subscribers
router.get('/admin/subscribers', authAdmin, async (req, res) => {
  try {
    const [subs] = await db.execute('SELECT * FROM newsletter_subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC');
    res.json({ success: true, data: subs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Career applications
router.get('/admin/applications', authAdmin, async (req, res) => {
  try {
    const [apps] = await db.execute('SELECT ca.*, c.title as position FROM career_applications ca JOIN careers c ON ca.career_id = c.id ORDER BY ca.created_at DESC');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
