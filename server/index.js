const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const escapeHtml = require('escape-html');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// 🛡️ ZABEZPIECZENIA - MIDDLEWARE
// Helmet - zabezpiecza HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "", "https:"],
    },
  },
}));

// Rate limiting - ogranicza liczbę requestów
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // maksymalnie 100 requestów na IP w ciągu 15 minut
  message: {
    success: false,
    message: 'Zbyt wiele requestów. Spróbuj ponownie za 15 minut.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting specjalnie dla endpoint emaila - bardziej restrykcyjny
const emailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minut
  max: 5, // maksymalnie 5 emaili na IP w ciągu 10 minut
  message: {
    success: false,
    message: 'Zbyt wiele emaili. Spróbuj ponownie za 10 minut.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS - konfiguracja bezpieczna
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing z limitami
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// 📧 KONFIGURACJA NODEMAILER (BEZPIECZNA)
const createTransporter = () => {
  // Sprawdź czy wszystkie zmienne środowiskowe są ustawione
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
    console.error('❌ Błąd: Brakuje zmiennych środowiskowych dla emaila');
    console.error('Wymagane: EMAIL_USER, EMAIL_PASS, RECIPIENT_EMAIL');
    process.exit(1);
  }

  return nodemailer.createTransport({
    service: 'gmail',
    secure: true, // używaj SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Użyj App Password, nie zwykłego hasła!
    },
    tls: {
      rejectUnauthorized: true
    }
  });
};

let transport;
try {
  transport = createTransporter();
  
  // Sprawdź połączenie przy starcie serwera
  transport.verify((error, success) => {
    if (error) {
      console.error('❌ Błąd konfiguracji emaila:', error);
    } else {
      console.log('✅ Serwer email gotowy do wysyłki');
    }
  });
} catch (error) {
  console.error('❌ Błąd tworzenia transportera:', error);
}

// 🔐 WALIDACJA I SANITYZACJA
const emailValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']+$/)
    .withMessage('Imię musi mieć 2-50 znaków i zawierać tylko litery, spacje, myślniki i apostrofy')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: false,
      outlookdotcom_remove_subaddress: false
    })
    .isLength({ max: 254 })
    .withMessage('Podaj prawidłowy adres email (max 254 znaki)'),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-.,!?()]+$/)
    .withMessage('Temat musi mieć 5-100 znaków i nie może zawierać niebezpiecznych znaków')
    .escape(),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .matches(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-.,!?()"\n\r]+$/)
    .withMessage('Wiadomość musi mieć 10-1000 znaków i nie może zawierać niebezpiecznych znaków')
    .escape()
];

// 📮 ENDPOINT DO WYSYŁANIA EMAILI
app.post('/api/send-email', 
  emailLimiter, // dodatkowe ograniczenie dla emaili
  emailValidation, // walidacja danych
  async (req, res) => {
    try {
      // Sprawdź błędy walidacji
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Błędy walidacji:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Dane formularza zawierają błędy',
          errors: errors.array()
        });
      }

      const { name, email, subject, message } = req.body;

      // Dodatkowe escapowanie dla HTML (podwójna ochrona)
      const escapedName = escapeHtml(name);
      const escapedSubject = escapeHtml(subject);
      const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');

      // Konfiguracja emaila
      const mailOptions = {
        from: `"SoundTech Pro Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email,
        subject: `[SoundTech Pro] ${escapedSubject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .content { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .warning { color: #d32f2f; font-size: 12px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🎵 Nowa wiadomość z formularza SoundTech Pro</h2>
                <p>Otrzymano: ${new Date().toLocaleString('pl-PL')}</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">👤 Imię i nazwisko:</div>
                  <div>${escapedName}</div>
                </div>
                <div class="field">
                  <div class="label">📧 Email:</div>
                  <div>${email}</div>
                </div>
                <div class="field">
                  <div class="label">📝 Temat:</div>
                  <div>${escapedSubject}</div>
                </div>
                <div class="field">
                  <div class="label">💬 Wiadomość:</div>
                  <div>${escapedMessage}</div>
                </div>
                <div class="warning">
                  ⚠️ To jest automatyczna wiadomość z formularza kontaktowego. 
                  Wszystkie dane zostały zwalidowane i oczyszczone ze względów bezpieczeństwa.
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        // Tekstowa wersja dla klientów nie obsługujących HTML
        text: `
Nowa wiadomość z formularza SoundTech Pro

Imię: ${escapedName}
Email: ${email}
Temat: ${escapedSubject}
Wiadomość: ${message}

Otrzymano: ${new Date().toLocaleString('pl-PL')}
        `
      };

      // Wyślij email
      const info = await transport.sendMail(mailOptions);
      
      console.log('✅ Email wysłany pomyślnie:', {
        messageId: info.messageId,
        from: escapedName,
        email: email,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Email został wysłany pomyślnie! Odpowiemy najszybciej jak to możliwe.',
        messageId: info.messageId
      });

    } catch (error) {
      console.error('❌ Błąd wysyłania emaila:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      res.status(500).json({
        success: false,
        message: 'Wystąpił błąd podczas wysyłania emaila. Spróbuj ponownie za chwilę.'
      });
    }
  }
);

// 🩺 TEST ENDPOINT
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'SoundTech Pro Backend działa poprawnie!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ❌ OBSŁUGA BŁĘDÓW 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint nie został znaleziony'
  });
});

// ❌ GLOBALNA OBSŁUGA BŁĘDÓW
app.use((error, req, res, next) => {
  console.error('❌ Nieoczekiwany błąd:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  res.status(500).json({
    success: false,
    message: 'Wystąpił błąd serwera'
  });
});

// 🚀 URUCHOMIENIE SERWERA
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🚀 SoundTech Pro Server uruchomiony!`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('🚀 ========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Otrzymano SIGTERM, zamykanie serwera...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Otrzymano SIGINT, zamykanie serwera...');
  process.exit(0);
});
