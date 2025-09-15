require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('../frontend'));
// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// 📩 POST route to send email
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      replyTo:email,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
      }
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔥 Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
