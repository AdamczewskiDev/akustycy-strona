{
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "nodemailer": "^7.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

index.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Konfiguracja transportera email (Gmail)
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Endpoint do wysyłania emaili
app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Walidacja danych
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Wszystkie pola są wymagane' 
    });
  }

  // Konfiguracja emaila
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL, // Twój email gdzie chcesz otrzymywać wiadomości
    subject: `Nowa wiadomość z formularza: ${subject}`,
    html: `
      <h3>Nowa wiadomość z formularza kontaktowego</h3>
      <p><strong>Imię:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temat:</strong> ${subject}</p>
      <p><strong>Wiadomość:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    // Email odpowiedzi do nadawcy
    replyTo: email
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email wysłany od: ${name} <${email}>`);
    res.status(200).json({ 
      success: true, 
      message: 'Email został wysłany pomyślnie!' 
    });
  } catch (error) {
    console.error('Błąd wysyłania emaila:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Wystąpił błąd podczas wysyłania emaila' 
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend działa poprawnie!' });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
