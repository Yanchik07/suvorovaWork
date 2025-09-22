// server.js
import 'dotenv/config';                   // подхватываем .env
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// антиспам на эндпоинт формы
app.use('/api/contact', rateLimit({ windowMs: 60_000, max: 10 }));

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, PORT } = process.env;

// Отправка в Telegram через ВСТРОЕННЫЙ fetch (Node 18+)
async function sendToTelegram({ name, email, phone, message, from }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[WARN] TELEGRAM_* env vars are not set; skipping send');
    return;
  }
  const text =
    `🆕 Новая заявка с сайта\n` +
    `— Имя: ${name}\n` +
    (email ? `— Email: ${email}\n` : '') +
    (phone ? `— Телефон: ${phone}\n` : '') +
    `— Сообщение: ${message}\n` +
    (from ? `— Страница: ${from}\n` : '');

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = { chat_id: TELEGRAM_CHAT_ID, text, disable_web_page_preview: true };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw new Error(`Telegram error: ${r.status} ${t}`);
  }
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, _hp } = req.body || {};
    if (_hp) return res.json({ ok: true }); // honeypot

    if (!name || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, error: 'Bad email' });

    await sendToTelegram({
      name: String(name).slice(0, 200),
      email: String(email || '').slice(0, 200),
      phone: String(phone || '').slice(0, 200),
      message: String(message).slice(0, 2000),
      from: req.headers?.referer || '',
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

const listenPort = Number(PORT) || 5174;
app.listen(listenPort, () => console.log(`API running on :${listenPort}`));
