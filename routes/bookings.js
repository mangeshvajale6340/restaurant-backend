const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Route 1: Add a new booking and send confirmation email
router.post('/', (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  const sql = 'INSERT INTO bookings (name, phone, date, time, guests) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, phone, date, time, guests], (err, result) => {
    if (err) {
      console.error('❌ Error inserting data:', err.sqlMessage);
      return res.status(500).json({ message: 'Booking failed' });
    }

    // ✅ Send confirmation email
    const mailOptions = {
      from: `"Your Restaurant" <${process.env.EMAIL_USER}>`,
      to: phone.includes('@') ? phone : '', // use email if phone is email
      subject: 'Table Booking Confirmation',
      text: `Dear ${name}, your table for ${guests} guest(s) has been booked on ${date} at ${time}. Thank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Email send error:', error);
      } else {
        console.log('📧 Email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Booking successful', id: result.insertId });
  });
});

// ✅ Route 2: Get all bookings
router.get('/', (req, res) => {
  db.query('SELECT * FROM bookings ORDER BY date, time', (err, results) => {
    if (err) {
      console.error('❌ Error fetching bookings:', err);
      return res.status(500).json({ message: 'Error fetching bookings' });
    }
    res.status(200).json(results);
  });
});

// ✅ Route 3: Delete a booking
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM bookings WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting booking:', err);
      return res.status(500).json({ message: 'Error deleting booking' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  });
});

module.exports = router;
