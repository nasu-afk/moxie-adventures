const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');

let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.warn('Razorpay not installed, payment routes disabled');
}

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    if (!Razorpay || !process.env.RAZORPAY_KEY_ID) {
      return res.status(503).json({ success: false, message: 'Payment gateway not configured' });
    }
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || 'rcpt_' + Date.now(),
      notes: notes || {}
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_ref, type } = req.body;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    if (type === 'trek' && booking_ref) {
      await db.execute(
        'UPDATE trek_bookings SET payment_status = "paid", status = "confirmed", razorpay_order_id = ?, razorpay_payment_id = ? WHERE booking_ref = ?',
        [razorpay_order_id, razorpay_payment_id, booking_ref]
      );
    } else if (type === 'event' && booking_ref) {
      await db.execute(
        'UPDATE event_registrations SET payment_status = "paid", status = "confirmed", razorpay_order_id = ?, razorpay_payment_id = ? WHERE registration_ref = ?',
        [razorpay_order_id, razorpay_payment_id, booking_ref]
      );
    }
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
