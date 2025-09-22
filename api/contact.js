// Vercel Serverless Function for contact form

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

    const { name, email, phone, message, _hp } = req.body || {};

    if (_hp) return res.json({ ok: true }); // honeypot

    if (!name || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, error: 'Bad email' });

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const text =
        `🆕 Новая заявка с сайта\n` +
        `— Имя: ${String(name).slice(0, 200)}\n` +
        (email ? `— Email: ${String(email).slice(0, 200)}\n` : '') +
        (phone ? `— Телефон: ${String(phone).slice(0, 200)}\n` : '') +
        `— Сообщение: ${String(message).slice(0, 2000)}`;

      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const payload = { chat_id: TELEGRAM_CHAT_ID, text, disable_web_page_preview: true };

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const t = await r.text().catch(() => '');
        return res.status(500).json({ ok: false, error: `Telegram error: ${r.status} ${t}` });
      }
    } else {
      console.warn('[WARN] TELEGRAM_* env vars are not set; skipping send');
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}


