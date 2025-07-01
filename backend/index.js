require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfolioDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Mongoose Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const Contact = mongoose.model('Contact', ContactSchema);
// const sendMail = require('./mail');

// POST route
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;  
  const newContact = new Contact({ name, email, phone, message }); 

  try {
    await newContact.save();

    // Email sending
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: 'harshgill916@gmail.com',
      to: 'harshgill916@gmail.com',
      subject: 'New Contact Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email Error:', error);
      } else {
        console.log('Email Sent:', info.response);
      }
    });

    res.send({ success: true, message: 'Message saved and email sent!' });

  } catch (err) {
    console.error("Form submission error:", err);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});


// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected to Atlas"))
  .catch((err) => console.error("MongoDB error:", err));


