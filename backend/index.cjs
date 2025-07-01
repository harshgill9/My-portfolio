require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mongoose Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const Contact = mongoose.model('Contact', ContactSchema);

// Run server and DB inside async block
(async () => {
  try {
    // MongoDB connection
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb+srv://harshgill916:Harshgill%40123@cluster0.690lfms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        dbName: 'portfolio',
      }
    );
    console.log('✅ MongoDB connected to Atlas');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // POST route
    app.post('/contact', async (req, res) => {
      const { name, email, phone, message } = req.body;
      const newContact = new Contact({ name, email, phone, message });

      try {
        await newContact.save();

        // Send email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'harshgill916@gmail.com',
          subject: 'New Contact Form Submission',
          text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Message: ${message}
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('❌ Email Error:', error);
          } else {
            console.log('📧 Email Sent:', info.response);
          }
        });

        res.send({ success: true, message: 'Message saved and email sent!' });
      } catch (err) {
        console.error('❌ Submission Error:', err);
        res.status(500).send({ success: false, message: 'Server error' });
      }
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
})();
