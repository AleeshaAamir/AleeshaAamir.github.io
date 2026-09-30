require('dotenv').config();

const path = require('path');
const fs = require('fs/promises');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');

// ---------- Security & parsing ----------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'data:'],
        frameSrc: ["'self'"],
        objectSrc: ["'self'"],
      },
    },
  })
);
app.use(express.json({ limit: '20kb' }));

// ---------- Mailer (optional: only if SMTP settings exist) ----------
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  transporter
    .verify()
    .then(() => console.log('✔ Mail server ready'))
    .catch((err) => console.warn('⚠ Mail server not reachable:', err.message));
} else {
  console.log('ℹ SMTP not configured. Messages will be saved to server/data/messages.json only.');
}

// ---------- Helpers ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

async function saveMessage(entry) {
  let messages = [];
  try {
    messages = JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8'));
  } catch {
    // file missing or empty: start fresh
  }
  messages.push(entry);
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// ---------- API ----------
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: 'Too many messages. Please try again in a few minutes.' },
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mail: Boolean(transporter) });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const name = clean(req.body.name, 100);
  const email = clean(req.body.email, 150);
  const subject = clean(req.body.subject, 150);
  const message = clean(req.body.message, 5000);
  const honeypot = clean(req.body.website, 100); // bots fill hidden fields

  if (honeypot) return res.json({ ok: true });

  const errors = {};
  if (name.length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (subject.length < 3) errors.subject = 'Please add a subject.';
  if (message.length < 10) errors.message = 'Message should be at least 10 characters.';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const entry = { name, email, subject, message, receivedAt: new Date().toISOString() };

  try {
    await saveMessage(entry);

    if (transporter) {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO || process.env.SMTP_USER,
        replyTo: `"${name}" <${email}>`,
        subject: `Portfolio: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p>
               <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      });
    }

    res.json({ ok: true, message: 'Thank you! Your message has been sent.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ ok: false, error: 'Something went wrong. Please email me directly.' });
  }
});

app.use('/api', (req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// ---------- Static site ----------
app.use(express.static(PUBLIC_DIR, { extensions: ['html'], maxAge: '7d' }));
app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html')));

app.listen(PORT, () => {
  console.log(`🚀 Portfolio running at http://localhost:${PORT}`);
});
