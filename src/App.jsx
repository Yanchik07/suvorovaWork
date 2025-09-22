import React, { useEffect, useState } from "react";

// ===== Helper data (замените своими данными) =====
const USER = {
  name: "Суворова Анна",
  role: "Инфографика для маркетплейсов",
  tagline:
    "Создаю карточки товаров для маркетплейсов (Ozon, Wildberries и др.)",
  location: "Ижевск, Россия",
  avatar:
    "/avatar.jpg",
  about:
    "Я начинающий дизайнер, фокусируюсь на инфографике для маркетплейсов (Ozon, Wildberries и др.). Делаю понятные карточки, акценты на выгодах и сравнении, работаю в Figma. Люблю чистую сетку, читаемую типографику и A/B-подход. Работаю с нейросетями для генерации идей и ускорения рутины. Готова к интересным проектам и развитию в дизайне.",
  email: "suvorova.work@yandex.ru",
  phone: "+7 (912) 755-32-00",
  socials: [
    { label: "Telegram", href: "https://t.me/suvor_a" },
    { label: "WhatsApp", href: "https://wa.me/89127553200" },
    { label: "Instagram", href: "https://instagram.com/suvor__a" },
  ],
};

const PROJECTS = [
  {
    id: 1,
    title: "Мыло ручной работы",
    cover:
      "first_project/main_page.png",
    tags: ["Ozon", "Карточки"],
    description:
      "",
  },
  {
    id: 2,
    title: "Наматрасник",
    cover:
      "second_project/1.png",
    tags: ["Wildberries", "Карточки"],
    description:
      "",
  },
];

// ===== Галерея / Карусель =====
const PROJECT_IMAGES = {
  1: [
    "first_project/main_page.png",
    "first_project/2.png",
    "first_project/3.png",
    "first_project/4.png",
  ],
  2: [
    "second_project/1.png",
    "second_project/2.png",
    "second_project/3.png",
    "second_project/4.png",
    "second_project/5.png",
  ],
};

function CarouselModal({ open, onClose, images = [], title }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  // touch/swipe
  useEffect(() => {
    if (!open) return;
    let startX = 0;
    const onStart = (e) => (startX = e.touches?.[0]?.clientX ?? 0);
    const onMove = (e) => {
      if (!startX) return;
      const x = e.touches?.[0]?.clientX ?? 0;
      const dx = x - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) setIndex((i) => (i + 1) % images.length);
        else setIndex((i) => (i - 1 + images.length) % images.length);
        startX = 0;
      }
    };
    const el = document.getElementById("carousel-viewport");
    el?.addEventListener("touchstart", onStart, { passive: true });
    el?.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      el?.removeEventListener("touchstart", onStart);
      el?.removeEventListener("touchmove", onMove);
    };
  }, [open, images.length]);

  if (!open || !images.length) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Галерея: ${title}`}
      onClick={onClose}
    >
      <div
        className="relative inline-block w-auto max-w-[90vw] bg-neutral-900/70 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 text-neutral-200 max-w-full">
          <span className="text-sm opacity-90">{title}</span>
          <button type="button" aria-label="Закрыть" onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <div id="carousel-viewport" className="relative select-none max-w-full">
          <img
            loading="lazy"
            src={images[index]}
            alt={`${title} — слайд ${index + 1}`}
            className="block max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain bg-black"
          />
          <button
            type="button"
            aria-label="Предыдущий"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20"
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Следующий"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20"
          >
            ▶
          </button>
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={
                  "w-2.5 h-2.5 rounded-full " +
                  (i === index ? "bg-white" : "bg-white/40 hover:bg-white/60")
                }
                aria-label={`Перейти к слайду ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== UI helpers =====
const Section = ({ id, title, children }) => (
  <section
  id={id}
  className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-24"
  >
    <div className="flex items-end justify-between mb-8">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
      <a
        href="#top"
        className="text-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
      >
        ↑ Наверх
      </a>
    </div>
    {children}
  </section>
);

const Badge = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-xs bg-black/5 dark:bg-white/10">
    {children}
  </span>
);

const useDarkMode = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("prefers-dark") === "true";
    setEnabled(stored);
    if (stored) document.documentElement.classList.add("dark");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", enabled);
    localStorage.setItem("prefers-dark", String(enabled));
  }, [enabled]);
  return { enabled, setEnabled };
};

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "ok" | "err" | null

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        // ВАЖНО: сохраняем ссылку на форму ДО await
        const form = e.currentTarget;

        const fd = new FormData(form);
        const payload = {
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          message: fd.get("message"),
          _hp: fd.get("_hp") || "", // honeypot
        };

        try {
          const r = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          // Диагностика — видно в DevTools → Console
          console.log("[contact] status:", r.status, r.statusText);
          console.log("[contact] content-type:", r.headers.get("content-type"));

          // Успех = любой 2xx
          const isOk = r.status >= 200 && r.status < 300;

          setStatus(isOk ? "ok" : "err");
          if (isOk) {
            form.reset(); // безопасно: используем сохранённую ссылку
          } else {
            const text = await r.text().catch(() => "");
            console.warn("[contact] non-2xx response body:", text);
          }
        } catch (err) {
          console.error("[contact] network error:", err);
          setStatus("err");
        } finally {
          setLoading(false);
        }
      }}
      className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
    >
      {/* honeypot (скрытое поле для защиты от ботов) */}
      <input name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

      <label className="block text-sm mb-2">Ваше имя</label>
      <input
        name="name"
        className="w-full mb-4 px-4 py-3 rounded-xl bg-transparent border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2"
        placeholder="Иван Иванов"
        required
      />

      <label className="block text-sm mb-2">Email</label>
      <input
        type="email"
        name="email"
        className="w-full mb-4 px-4 py-3 rounded-xl bg-transparent border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2"
        placeholder="you@mail.com"
      />

      <label className="block text-sm mb-2">Телефон</label>
      <input
        name="phone"
        className="w-full mb-4 px-4 py-3 rounded-xl bg-transparent border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2"
        placeholder="+7 ..."
      />

      <label className="block text-sm mb-2">Сообщение</label>
      <textarea
        name="message"
        rows={5}
        className="w-full mb-4 px-4 py-3 rounded-xl bg-transparent border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2"
        placeholder="Коротко опишите задачу"
        required
      />

      <button
        className="w-full rounded-xl px-4 py-3 font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Отправка..." : "Отправить"}
      </button>

      {status === "ok" && (
        <p className="mt-3 text-sm text-emerald-600" aria-live="polite">
          Спасибо! Заявка отправлена.
        </p>
      )}
      {status === "err" && (
        <p className="mt-3 text-sm text-rose-600" aria-live="assertive">
          Ошибка отправки. Попробуйте позже.
        </p>
      )}

      <p className="mt-3 text-xs opacity-70">
        * Данные отправляются в Telegram владельцу сайта.
      </p>
    </form>
  );
}

// ===== Main App =====
export default function PortfolioSite() {
  const { enabled, setEnabled } = useDarkMode();
  const [lightbox, setLightbox] = useState({ open: false, images: [], title: "" });

  const openProject = (project) => {
    const images = PROJECT_IMAGES[project.id] || [];
    setLightbox({ open: true, images, title: project.title });
  };

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = lightbox.open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [lightbox.open]);

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* ===== Header / Nav ===== */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">{USER.name}</a>
          <nav className="hidden sm:flex gap-6 text-sm">
            <a className="hover:opacity-100 opacity-70" href="#about">Обо мне</a>
            <a className="hover:opacity-100 opacity-70" href="#work">Работы</a>
            <a className="hover:opacity-100 opacity-70" href="#contact">Контакты</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setEnabled(!enabled)}
              className="rounded-xl px-3 py-1.5 text-sm border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            >
              {enabled ? "🌙" : "☀️"}
            </button>
            <a
              href="#contact"
              className="hidden sm:inline-flex rounded-xl px-3 py-1.5 text-sm border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Написать
            </a>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-sky-400/10 to-emerald-400/10 dark:from-fuchsia-500/10 dark:via-sky-400/10 dark:to-emerald-400/10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
            <img
              src={USER.avatar}
              alt="Аватар"
              className="w-48 h-48 rounded-2xl object-cover ring-4 ring-white/60 dark:ring-white/10"
            />
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">{USER.role}</h1>
              <p className="mt-4 text-lg opacity-80 max-w-2xl">{USER.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge>{USER.location}</Badge>
                <Badge>Инфографика • Маркетплейсы</Badge>
                <Badge>Работа с нейросетями</Badge>
                <Badge>Готова учиться и развиваться</Badge>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {USER.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <Section id="about" title="Обо мне">
        <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-10 items-start">
          <p className="leading-8 text-balance opacity-90">{USER.about}</p>
          <ul className="grid grid-cols-2 grid-rows-2 auto-rows-fr gap-3 text-sm">
            <li className="p-4 rounded-2xl border border-black/10 dark:border-white/10">Инфографика</li>
            <li className="p-4 rounded-2xl border border-black/10 dark:border-white/10">Нейросети</li>
            <li className="p-4 rounded-2xl border border-black/10 dark:border-white/10">Подготовка макетов для маркетплейсов</li>
            <li className="p-4 rounded-2xl border border-black/10 dark:border-white/10">A/B-варианты слайдов</li>
          </ul>
        </div>
      </Section>

      {/* ===== Work / Portfolio ===== */}
      <Section id="work" title="Работы">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
         {PROJECTS.map((p) => (
            <article
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 cursor-pointer"
              onClick={() => openProject(p)}
            >
              <div className="overflow-hidden relative">
                <img
                  loading="lazy"
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium text-lg">{p.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm opacity-90 line-clamp-2">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Модалка с каруселью */}
        <CarouselModal
          open={lightbox.open}
          onClose={() => setLightbox({ open: false, images: [], title: "" })}
          images={lightbox.images}
          title={lightbox.title}
        />
      </Section>

      {/* ===== Contact ===== */}
      <Section id="contact" title="Контакты">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="opacity-90">Есть интересный проект или задача? Напишите — отвечу в течение рабочего дня.</p>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="opacity-70">Email: </span>
                <a className="underline underline-offset-4" href={`mailto:${USER.email}`}>{USER.email}</a>
              </li>
              <li>
                <span className="opacity-70">Телефон: </span>
                <a className="underline underline-offset-4" href={`tel:${USER.phone}`}>{USER.phone}</a>
              </li>
            </ul>
            <div className="flex gap-3 flex-wrap pt-2">
              {USER.socials.map((s) => (
                <a key={s.label} href={s.href} className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="opacity-70">© {new Date().getFullYear()} {USER.name}. Все права защищены.</p>
          <div className="flex items-center gap-3">
            <a className="underline underline-offset-4 opacity-80 hover:opacity-100" href="#top">Наверх</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== Пояснения =====
— Ключевой фикс: сохранить ссылку на форму (const form = e.currentTarget) до await и использовать form.reset().
— Успех считается по HTTP 2xx. В консоль выводится статус и content-type для диагностики.
*/