import { useEffect, useId, useRef, useState } from 'react'
import './App.css'

/* ------------------------------------------------------------------ */
/*  Įmonės duomenys – TODO: pakeiskite tikrais                          */
/* ------------------------------------------------------------------ */

const COMPANY = {
  name: 'Artstata',
  phone: '+370 600 00000',
  phoneHref: 'tel:+37060000000',
  email: 'info@artstata.lt',
  address: 'Statybininkų g. 1, LT-01100 Vilnius',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
}

// Jei tuščia – forma tik imituoja išsiuntimą. Įrašykite savo API / Formspree adresą.
const FORM_ENDPOINT = ''

const NAV = [
  { id: 'paslaugos', label: 'Paslaugos' },
  { id: 'apie', label: 'Apie mus' },
  { id: 'galerija', label: 'Galerija' },
  { id: 'atsiliepimai', label: 'Atsiliepimai' },
  { id: 'duk', label: 'DUK' },
  { id: 'kontaktai', label: 'Kontaktai' },
]

/* ------------------------------------------------------------------ */
/*  Ikonos                                                             */
/* ------------------------------------------------------------------ */

const ICONS = {
  house: 'M3 10.5 12 3l9 7.5M5 9v11h14V9M9.5 20v-6h5v6',
  hammer: 'm14 7 3-3 3 3-3 3m-3-3L4 17l3 3 10-10m-3-3 3 3',
  bath: 'M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Zm2 0V5.5A2.5 2.5 0 0 1 10.5 5M7 19l-1 2m11-2 1 2',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  roof: 'M2 12 12 4l10 8M6 9.5V20h12V9.5M10 20v-5h4v5',
  layers: 'M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  roller: 'M4 4h13v5H4zM17 6.5h3v5.5h-8v3M11 15h2v6h-2z',
  building: 'M4 21V5l8-2v18M12 7h8v14M4 21h17M8 8h.01M8 12h.01M8 16h.01M16 11h.01M16 15h.01',
  medal: 'M8 3h8l-2 6h-4L8 3Zm4 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 3 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4L12 12Z',
  shield: 'M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Zm-3.5 9 2.5 2.5 4.5-5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h3',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  pin: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  chevron: 'm6 9 6 6 6-6',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
}

function Icon({ name, size = 24, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICONS[name]} />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.6V4.3a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.2H7.5v3h2.6V21h3.4Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Logo() {
  // TODO: pakeiskite tikru logotipu (SVG)
  return (
    <span className="logo">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round">
          <path d="M3 13 12 5l9 8M7 11v8h10v-8" />
        </svg>
      </span>
      <span className="logo__text">{COMPANY.name}</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Spyruoklinė animacija (be priklausomybių)                           */
/*  Apple principai: animacija prasideda nuo dabartinės reikšmės,       */
/*  perima greitį ir gali būti pertraukta bet kuriuo momentu.            */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function animateSpring({ from, to, velocity = 0, response = 0.35, damping = 1, onUpdate }) {
  const stiffness = (2 * Math.PI / response) ** 2
  const friction = (4 * Math.PI * damping) / response
  let x = from
  let v = velocity
  let last = performance.now()
  let frame = 0

  const step = (now) => {
    const dt = Math.min((now - last) / 1000, 0.064)
    last = now
    const n = Math.max(1, Math.ceil(dt / 0.002))
    const h = dt / n
    for (let i = 0; i < n; i++) {
      v += (-stiffness * (x - to) - friction * v) * h
      x += v * h
    }
    if (Math.abs(x - to) < 0.01 && Math.abs(v) < 0.05) {
      onUpdate(to)
      return
    }
    onUpdate(x)
    frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
  return { stop: () => cancelAnimationFrame(frame) }
}

// Apple'o momentum projekcija (Designing Fluid Interfaces)
const projectMomentum = (velocity, rate = 0.99) => ((velocity / 1000) * rate) / (1 - rate)

// Progresyvus pasipriešinimas už ribų
const rubberband = (overshoot, dimension, c = 0.55) =>
  (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot))

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/* ------------------------------------------------------------------ */
/*  Pagalbiniai hook'ai                                                 */
/* ------------------------------------------------------------------ */

function useScrollSpy(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('reveal-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            observer.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}

/* ------------------------------------------------------------------ */
/*  Vietos rezervavimo nuotrauka                                        */
/* ------------------------------------------------------------------ */

function Photo({ src, alt, label, tone = 'warm', ratio = '4 / 3', className = '' }) {
  if (src) {
    return (
      <img
        className={`photo ${className}`}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: ratio }}
      />
    )
  }
  return (
    <div
      className={`photo photo--placeholder photo--${tone} ${className}`}
      role="img"
      aria-label={`${alt} (laikinas paveikslėlis)`}
      style={{ aspectRatio: ratio }}
    >
      <span className="photo__tag">Nuotrauka bus pakeista</span>
      {label && <span className="photo__label">{label}</span>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Antraštė / navigacija                                               */
/* ------------------------------------------------------------------ */

const NAV_IDS = NAV.map((n) => n.id)

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(NAV_IDS)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 960 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="site-header" data-scrolled={scrolled} data-open={open}>
      <div className="container site-header__bar">
        <a href="#top" className="site-header__brand" aria-label={`${COMPANY.name} – į puslapio pradžią`}>
          <Logo />
        </a>

        <nav className="site-nav" aria-label="Pagrindinė navigacija">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#kontaktai" className="btn btn--primary btn--sm site-header__cta">
          Gauti sąmatą
        </a>

        <button
          ref={buttonRef}
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Uždaryti meniu' : 'Atidaryti meniu'}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      <div className="mobile-scrim" aria-hidden="true" onClick={() => setOpen(false)} />
      <nav
        id="mobile-menu"
        ref={menuRef}
        className="mobile-menu"
        aria-label="Mobilioji navigacija"
        inert={!open}
      >
        <ul>
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <Icon name="arrow" size={18} />
              </a>
            </li>
          ))}
        </ul>
        <a href="#kontaktai" className="btn btn--primary btn--block" onClick={() => setOpen(false)}>
          Gauti nemokamą sąmatą
        </a>
        <a href={COMPANY.phoneHref} className="mobile-menu__phone">
          <Icon name="phone" size={18} /> {COMPANY.phone}
        </a>
      </nav>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">Statybos ir remonto paslaugos Vilniuje ir regione</p>
          <h1 id="hero-title" className="display">
            Kokybiški statybos ir&nbsp;remonto darbai
          </h1>
          <p className="hero__lede">
            Statome, renovuojame ir įrengiame – nuo pamatų iki paskutinio dažų sluoksnio. Aiški
            sąmata, sutartyje įrašyti terminai ir rašytinė garantija atliktiems darbams.
          </p>
          <div className="hero__actions">
            <a href="#kontaktai" className="btn btn--primary btn--lg">
              Gauti nemokamą sąmatą
              <Icon name="arrow" size={20} />
            </a>
            <a href={COMPANY.phoneHref} className="btn btn--ghost btn--lg">
              <Icon name="phone" size={20} />
              Skambinti
            </a>
          </div>
          <ul className="hero__trust" aria-label="Trumpai apie mus">
            <li>
              <strong>15+</strong> metų patirties
            </li>
            <li>
              <strong>320+</strong> užbaigtų projektų
            </li>
            <li>
              <strong>5 m.</strong> garantija
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <Photo
            alt="Komanda dirba statybų objekte"
            label="Hero nuotrauka · 1600×1200"
            tone="warm"
            ratio="4 / 5"
            className="hero__photo"
          />
          <div className="hero__badge glass">
            <span className="hero__badge-icon">
              <Icon name="clock" size={20} />
            </span>
            <span>
              <strong>Atsakome per 1 darbo dieną</strong>
              <span>Sąmata – nemokamai</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Paslaugos                                                          */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    icon: 'house',
    title: 'Naujų namų statyba',
    text: 'Individualių namų statyba nuo projekto iki raktų: pamatai, sienos, stogas ir inžinerinės sistemos – vienose rankose.',
  },
  {
    icon: 'hammer',
    title: 'Būstų remontas',
    text: 'Kapitalinis ir kosmetinis butų bei namų remontas. Darbus planuojame taip, kad kasdienis gyvenimas būtų kuo mažiau sutrikdytas.',
  },
  {
    icon: 'bath',
    title: 'Vonios ir virtuvės įrengimas',
    text: 'Hidroizoliacija, plytelės, santechnika ir baldų montavimas. Įrengiame patogias ir ilgai tarnaujančias erdves.',
  },
  {
    icon: 'bolt',
    title: 'Elektros ir santechnikos darbai',
    text: 'Elektros instaliacija, skydinės, vandentiekio ir šildymo sistemos. Darbus atlieka atestuoti specialistai.',
  },
  {
    icon: 'roof',
    title: 'Stogo darbai',
    text: 'Naujų stogų įrengimas, senų dangų keitimas, šiltinimas ir lietaus nuvedimo sistemos.',
  },
  {
    icon: 'layers',
    title: 'Fasado apšiltinimas',
    text: 'Fasadų šiltinimas ir apdaila, mažinanti šildymo išlaidas. Patariame dėl valstybės paramos galimybių.',
  },
  {
    icon: 'roller',
    title: 'Interjero apdaila',
    text: 'Glaistymas, dažymas, grindų dangos, gipso kartono konstrukcijos ir dekoratyvinė apdaila.',
  },
  {
    icon: 'building',
    title: 'Komercinių patalpų remontas',
    text: 'Biurų, parduotuvių ir kavinių remontas. Galime dirbti vakarais ar savaitgaliais, kad netrukdytume jūsų veiklai.',
  },
]

function SectionHead({ eyebrow, title, lede, id, align = 'start' }) {
  return (
    <div className={`section-head section-head--${align} reveal`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="title">
        {title}
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  )
}

function Services() {
  return (
    <section id="paslaugos" className="section" aria-labelledby="paslaugos-title">
      <div className="container">
        <SectionHead
          id="paslaugos-title"
          eyebrow="Paslaugos"
          title="Viskas, ko reikia jūsų namams ir verslui"
          lede="Atliekame visą statybos ir remonto darbų ciklą su savo komanda, todėl nereikia derinti kelių skirtingų rangovų."
        />
        <ul className="services-grid">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="card service-card reveal" style={{ '--i': i % 4 }}>
              <span className="icon-tile">
                <Icon name={s.icon} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Apie mus                                                           */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: '15+', label: 'metų patirties' },
  { value: '320+', label: 'užbaigtų projektų' },
  { value: '24', label: 'specialistų komanda' },
  { value: '5 m.', label: 'garantija darbams' },
]

const CREDENTIALS = [
  'Atestuoti statybos darbų vadovai',
  'Kvalifikuoti elektros instaliacijos specialistai',
  'Civilinės atsakomybės draudimas',
  'Rašytinė garantija visiems darbams',
]

function About() {
  return (
    <section id="apie" className="section section--tint" aria-labelledby="apie-title">
      <div className="container about">
        <div className="about__media reveal">
          <Photo alt="Mūsų komanda prie užbaigto namo" label="Komandos nuotrauka · 1200×1400" tone="stone" ratio="6 / 7" />
        </div>
        <div className="about__copy">
          <SectionHead
            id="apie-title"
            eyebrow="Apie mus"
            title="Vietinė komanda, kuri atsako už rezultatą"
          />
          <div className="about__text reveal">
            <p>
              {COMPANY.name} pradėjo kaip nedidelė apdailininkų komanda Vilniuje. Šiandien vykdome visą
              statybos ir remonto ciklą – nuo pirmos konsultacijos iki objekto perdavimo – Vilniuje ir
              aplinkiniuose rajonuose.
            </p>
            <p>
              Kiekvienam projektui skiriame atsakingą darbų vadovą. Jis yra jūsų vienintelis kontaktinis
              asmuo nuo pradžios iki pabaigos, todėl visada žinote, kas vyksta objekte ir kas bus daroma
              toliau.
            </p>
          </div>
          <dl className="stats reveal">
            {STATS.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="checklist reveal" aria-label="Leidimai ir sertifikatai">
            {CREDENTIALS.map((c) => (
              <li key={c}>
                <Icon name="check" size={18} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Kodėl mes                                                          */
/* ------------------------------------------------------------------ */

const REASONS = [
  {
    icon: 'medal',
    title: 'Patirtis',
    text: 'Daugiau nei 15 metų ir šimtai užbaigtų objektų. Žinome, kur dažniausiai slypi rizikos, ir jas įvertiname iš anksto.',
  },
  {
    icon: 'shield',
    title: 'Garantija',
    text: 'Rašytinė garantija: 5 metai atliktiems darbams ir 10 metų paslėptiems elementams. Pastebėtus defektus šaliname savo sąskaita.',
  },
  {
    icon: 'clock',
    title: 'Laikomės terminų',
    text: 'Terminus įrašome į sutartį ir kas savaitę informuojame apie darbų eigą su nuotraukomis.',
  },
  {
    icon: 'receipt',
    title: 'Skaidrios kainos',
    text: 'Detali sąmata, kurioje darbai ir medžiagos nurodyti atskirai. Kaina nesikeičia, jei nesikeičia darbų apimtis.',
  },
]

function WhyUs() {
  return (
    <section id="kodel-mes" className="section section--dark" aria-labelledby="kodel-title">
      <div className="container">
        <SectionHead
          id="kodel-title"
          eyebrow="Kodėl rinktis mus"
          title="Ramybė nuo sąmatos iki raktų perdavimo"
          align="center"
        />
        <ul className="reasons">
          {REASONS.map((r, i) => (
            <li key={r.title} className="reason reveal" style={{ '--i': i }}>
              <span className="icon-tile icon-tile--accent">
                <Icon name={r.icon} />
              </span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Galerija su „prieš / po“ slankikliu                                 */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: 'visi', label: 'Visi' },
  { id: 'vonios', label: 'Vonios' },
  { id: 'virtuves', label: 'Virtuvės' },
  { id: 'interjeras', label: 'Interjeras' },
  { id: 'fasadai', label: 'Fasadai' },
  { id: 'stogai', label: 'Stogai' },
]

// TODO: įrašykite before / after nuotraukų kelius (pvz. '/galerija/vonia-pries.jpg')
const PROJECTS = [
  { id: 1, cat: 'vonios', title: 'Vonios kambario renovacija', place: 'Vilnius, Antakalnis', before: '', after: '' },
  { id: 2, cat: 'virtuves', title: 'Virtuvės įrengimas', place: 'Vilnius, Pilaitė', before: '', after: '' },
  { id: 3, cat: 'fasadai', title: 'Namo fasado apšiltinimas', place: 'Trakų r.', before: '', after: '' },
  { id: 4, cat: 'interjeras', title: 'Buto interjero apdaila', place: 'Vilnius, Užupis', before: '', after: '' },
  { id: 5, cat: 'stogai', title: 'Stogo dangos keitimas', place: 'Nemenčinė', before: '', after: '' },
  { id: 6, cat: 'vonios', title: 'Svečių vonios įrengimas', place: 'Vilnius, Pavilnys', before: '', after: '' },
]

function Compare({ project }) {
  const rootRef = useRef(null)
  const handleRef = useRef(null)
  const pos = useRef(50)
  const anim = useRef(null)
  const drag = useRef(null)

  useEffect(() => () => anim.current?.stop(), [])

  const apply = (v) => {
    pos.current = v
    rootRef.current?.style.setProperty('--pos', `${v}%`)
    const shown = Math.round(clamp(v, 0, 100))
    handleRef.current?.setAttribute('aria-valuenow', String(shown))
    handleRef.current?.setAttribute('aria-valuetext', `Rodoma ${shown} % nuotraukos „po“`)
  }

  const springTo = (target, { velocity = 0, damping = 1 } = {}) => {
    anim.current?.stop()
    if (prefersReducedMotion()) return apply(target)
    anim.current = animateSpring({ from: pos.current, to: target, velocity, damping, response: 0.35, onUpdate: apply })
  }

  const toPercent = (clientX) => {
    const r = rootRef.current.getBoundingClientRect()
    return ((clientX - r.left) / r.width) * 100
  }

  const withResistance = (raw) => {
    if (raw < 0) return -rubberband(-raw, 100)
    if (raw > 100) return 100 + rubberband(raw - 100, 100)
    return raw
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const p = toPercent(e.clientX)
    const nearHandle = Math.abs(p - pos.current) * (rootRef.current.offsetWidth / 100) < 28
    e.currentTarget.setPointerCapture(e.pointerId)
    rootRef.current.dataset.pressed = ''
    drag.current = { id: e.pointerId, startX: e.clientX, tracking: nearHandle, offset: p - pos.current, samples: [] }
    if (nearHandle) anim.current?.stop()
    else springTo(clamp(p, 0, 100)) // bakstelėjimas – keliaujame link piršto, galima perimti
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const p = toPercent(e.clientX)
    if (!d.tracking) {
      if (Math.abs(e.clientX - d.startX) < 6) return
      // perimame iš dabartinės ekrane matomos reikšmės – jokio šuolio
      anim.current?.stop()
      d.tracking = true
      d.offset = p - pos.current
    }
    const raw = p - d.offset
    apply(withResistance(raw))
    d.samples.push({ t: e.timeStamp, x: raw })
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift()
  }

  const onPointerEnd = (e) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    delete rootRef.current.dataset.pressed
    if (!d.tracking) return
    const s = d.samples
    const velocity = s.length > 1 ? ((s.at(-1).x - s[0].x) / Math.max(1, s.at(-1).t - s[0].t)) * 1000 : 0
    const target = clamp(pos.current + projectMomentum(velocity), 0, 100)
    const flicked = Math.abs(velocity) > 120
    springTo(target, { velocity, damping: flicked ? 0.8 : 1 })
  }

  const onKeyDown = (e) => {
    const steps = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }
    let target
    if (e.key in steps) target = clamp(Math.round(pos.current) + steps[e.key], 0, 100)
    else if (e.key === 'Home') target = 0
    else if (e.key === 'End') target = 100
    else return
    e.preventDefault()
    springTo(target)
  }

  return (
    <div
      ref={rootRef}
      className="compare"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    >
      <Photo src={project.before} alt={`${project.title} – prieš`} label="Prieš · 1200×900" tone="stone" className="compare__img" />
      <div className="compare__after">
        <Photo src={project.after} alt={`${project.title} – po`} label="Po · 1200×900" tone="warm" className="compare__img" />
      </div>
      <span className="compare__chip compare__chip--before glass" aria-hidden="true">Prieš</span>
      <span className="compare__chip compare__chip--after glass" aria-hidden="true">Po</span>
      <div
        ref={handleRef}
        className="compare__handle"
        role="slider"
        tabIndex={0}
        aria-label={`${project.title}: palyginti prieš ir po`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-valuetext="Rodoma 50 % nuotraukos „po“"
        onKeyDown={onKeyDown}
      >
        <span className="compare__knob glass">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  )
}

const pluralDarbai = (n) => {
  const d = n % 10
  const t = n % 100
  if (d === 1 && t !== 11) return 'darbas'
  if (d >= 2 && !(t >= 11 && t <= 19)) return 'darbai'
  return 'darbų'
}

function Gallery() {
  const [filter, setFilter] = useState('visi')
  const shown = filter === 'visi' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)

  return (
    <section id="galerija" className="section" aria-labelledby="galerija-title">
      <div className="container">
        <SectionHead
          id="galerija-title"
          eyebrow="Darbų galerija"
          title="Prieš ir po"
          lede="Patraukite slankiklį ir pamatykite, kaip pasikeitė erdvės. Rodomi tik mūsų pačių atlikti darbai."
        />

        <div className="filters reveal" role="group" aria-label="Filtruoti pagal kategoriją">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Rodoma {shown.length} {pluralDarbai(shown.length)}
        </p>

        <ul className="gallery-grid">
          {shown.map((p) => (
            <li key={p.id} className="gallery-item">
              <figure>
                <Compare project={p} />
                <figcaption>
                  <strong>{p.title}</strong>
                  <span>{p.place}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Atsiliepimai                                                       */
/* ------------------------------------------------------------------ */

// TODO: pakeiskite tikrais klientų atsiliepimais (gavus jų sutikimą)
const TESTIMONIALS = [
  {
    quote:
      'Remontavome seną butą Žirmūnuose. Darbų vadovas kas savaitę siųsdavo nuotraukas, o galutinė kaina sutapo su sąmata iki euro. Tikrai rekomenduoju.',
    name: 'Rasa K.',
    project: 'Buto remontas',
  },
  {
    quote:
      'Apšiltino ir atnaujino mūsų namo fasadą per tris savaites, kaip ir buvo sutarta. Šią žiemą sąskaitos už šildymą gerokai mažesnės.',
    name: 'Tomas ir Eglė P.',
    project: 'Fasado apšiltinimas',
  },
  {
    quote:
      'Įrengė naują virtuvę mūsų kavinėje dirbdami naktimis, todėl neteko užsidaryti nė dienai. Tvarkinga ir profesionali komanda.',
    name: 'Mindaugas S.',
    project: 'Komercinių patalpų remontas',
  },
]

function Testimonials() {
  return (
    <section id="atsiliepimai" className="section section--tint" aria-labelledby="atsiliepimai-title">
      <div className="container">
        <SectionHead id="atsiliepimai-title" eyebrow="Atsiliepimai" title="Ką sako mūsų klientai" />
        <ul className="testimonials">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name} className="card testimonial reveal" style={{ '--i': i }}>
              <figure>
                <div className="stars" role="img" aria-label="Įvertinimas: 5 iš 5">
                  {'★★★★★'}
                </div>
                <blockquote>
                  <p>„{t.quote}“</p>
                </blockquote>
                <figcaption>
                  <span className="avatar" aria-hidden="true">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>{t.project}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Procesas                                                           */
/* ------------------------------------------------------------------ */

const STEPS = [
  { title: 'Konsultacija', text: 'Atvykstame į objektą, išklausome jūsų poreikius ir įvertiname esamą būklę. Nemokamai.' },
  { title: 'Sąmata', text: 'Per 3–5 darbo dienas parengiame detalią sąmatą su darbų grafiku ir medžiagų sąrašu.' },
  { title: 'Sutartis', text: 'Pasirašome sutartį, kurioje aiškiai nurodyta kaina, terminai ir garantijos sąlygos.' },
  { title: 'Darbai', text: 'Dirbame pagal grafiką, o darbų vadovas reguliariai informuoja apie eigą.' },
  { title: 'Perdavimas', text: 'Kartu apžiūrime rezultatą, pasirašome perdavimo aktą ir įteikiame garantinius dokumentus.' },
]

function Process() {
  return (
    <section id="procesas" className="section" aria-labelledby="procesas-title">
      <div className="container">
        <SectionHead
          id="procesas-title"
          eyebrow="Kaip dirbame"
          title="Penki aiškūs žingsniai"
          lede="Nuo pirmo skambučio iki raktų perdavimo žinote, kas vyksta ir kas bus toliau."
        />
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step reveal" style={{ '--i': i }}>
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  DUK                                                                */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'Kiek kainuoja remontas ar statyba?',
    a: 'Kaina priklauso nuo darbų apimties, pasirinktų medžiagų ir patalpų būklės. Todėl pirmiausia atvykstame į objektą ir nemokamai parengiame detalią sąmatą – joje matysite kiekvieno darbo ir medžiagų kainą atskirai.',
  },
  {
    q: 'Kiek laiko užtrunka darbai?',
    a: 'Vonios kambario įrengimas paprastai trunka 2–3 savaites, viso buto remontas – 1–3 mėnesius, individualaus namo statyba – nuo 6 mėnesių. Tikslų terminą įrašome į sutartį ir jo laikomės.',
  },
  {
    q: 'Kokią garantiją suteikiate?',
    a: 'Garantiją suteikiame pagal Lietuvos Respublikos civilinį kodeksą: atliktiems darbams – 5 metai, paslėptiems elementams (konstrukcijoms, inžinerinėms sistemoms) – 10 metų. Medžiagoms galioja gamintojų garantijos.',
  },
  {
    q: 'Ar reikia leidimų statybai ar remontui?',
    a: 'Priklauso nuo darbų. Paprastam remontui leidimo nereikia, tačiau naujo namo statybai, kapitaliniam remontui ar fasado pakeitimams dažniausiai reikalingas statybą leidžiantis dokumentas. Padedame išsiaiškinti, ko reikia jūsų atveju, ir kartu su projektuotojais pasirūpiname dokumentais.',
  },
  {
    q: 'Ar galiu medžiagas įsigyti pats?',
    a: 'Taip. Medžiagas galite pirkti patys arba patikėti tai mums – dėl partnerių nuolaidų dažnai gauname geresnes kainas. Bet kuriuo atveju visos medžiagų sąnaudos matomos sąmatoje.',
  },
]

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="faq__item" data-open={open}>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{item.q}</span>
          <Icon name="chevron" size={20} className="faq__chevron" />
        </button>
      </h3>
      <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="faq__panel" inert={!open}>
        <div className="faq__inner">
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

function Faq() {
  return (
    <section id="duk" className="section section--tint" aria-labelledby="duk-title">
      <div className="container faq">
        <SectionHead
          id="duk-title"
          eyebrow="DUK"
          title="Dažniausiai užduodami klausimai"
          lede={
            <>
              Neradote atsakymo? Paskambinkite <a href={COMPANY.phoneHref}>{COMPANY.phone}</a> – mielai
              patarsime.
            </>
          }
        />
        <div className="faq__list reveal">
          {FAQ.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Kontaktai                                                          */
/* ------------------------------------------------------------------ */

const SERVICE_OPTIONS = [
  'Naujo namo statyba',
  'Būsto remontas',
  'Vonios ar virtuvės įrengimas',
  'Elektros ir santechnikos darbai',
  'Stogo darbai',
  'Fasado apšiltinimas',
  'Interjero apdaila',
  'Komercinių patalpų remontas',
  'Kita',
]

const EMPTY_FORM = { name: '', email: '', phone: '', service: '', message: '', consent: false, company: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Įveskite savo vardą.'
  if (!v.email.trim()) e.email = 'Įveskite el. pašto adresą.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = 'Patikrinkite el. pašto adresą – atrodo, kad jame yra klaida.'
  const digits = v.phone.replace(/[\s()-]/g, '')
  if (!digits) e.phone = 'Įveskite telefono numerį.'
  else if (!/^(\+3706\d{7}|86\d{7}|\+?\d{9,15})$/.test(digits))
    e.phone = 'Įveskite numerį, pvz., +370 600 00000.'
  if (!v.service) e.service = 'Pasirinkite paslaugą.'
  if (v.message.trim().length < 10) e.message = 'Trumpai aprašykite darbus (bent 10 simbolių).'
  if (!v.consent) e.consent = 'Reikia jūsų sutikimo, kad galėtume atsakyti.'
  return e
}

function Field({ id, label, error, touched, hint, children }) {
  const showError = touched && error
  return (
    <div className="field" data-invalid={showError ? '' : undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {showError ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const formRef = useRef(null)
  const errors = validate(values)

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
  }
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const describe = (name) =>
    touched[name] && errors[name] ? `field-${name}-error` : undefined
  const common = (name) => ({
    id: `field-${name}`,
    name,
    value: values[name],
    onChange: update,
    onBlur: blur,
    'aria-invalid': touched[name] && errors[name] ? true : undefined,
    'aria-describedby': describe(name),
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (values.company) return // botų spąstai
    const all = Object.fromEntries(Object.keys(EMPTY_FORM).map((k) => [k, true]))
    setTouched(all)
    if (Object.keys(errors).length) {
      const first = Object.keys(EMPTY_FORM).find((k) => errors[k])
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        await new Promise((r) => setTimeout(r, 700))
      }
      setStatus('success')
      setValues(EMPTY_FORM)
      setTouched({})
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card form-success" role="status">
        <span className="icon-tile icon-tile--accent">
          <Icon name="check" />
        </span>
        <h3>Ačiū! Užklausą gavome.</h3>
        <p>Susisieksime su jumis per 1 darbo dieną ir suderinsime konsultacijos laiką.</p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
          Siųsti dar vieną užklausą
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="card contact-form" noValidate onSubmit={onSubmit} aria-labelledby="form-title">
      <h3 id="form-title">Gauti nemokamą sąmatą</h3>
      <p className="contact-form__note">Visi laukai privalomi.</p>

      <div className="form-grid">
        <Field id="field-name" label="Vardas" error={errors.name} touched={touched.name}>
          <input type="text" autoComplete="name" {...common('name')} />
        </Field>
        <Field id="field-phone" label="Telefonas" error={errors.phone} touched={touched.phone}>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+370 600 00000" {...common('phone')} />
        </Field>
        <Field id="field-email" label="El. paštas" error={errors.email} touched={touched.email}>
          <input type="email" autoComplete="email" inputMode="email" {...common('email')} />
        </Field>
        <Field id="field-service" label="Paslaugos tipas" error={errors.service} touched={touched.service}>
          <select {...common('service')}>
            <option value="" disabled>
              Pasirinkite…
            </option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field id="field-message" label="Žinutė" error={errors.message} touched={touched.message}>
          <textarea rows={5} placeholder="Trumpai aprašykite, kokius darbus norėtumėte atlikti, objekto vietą ir pageidaujamą laiką." {...common('message')} />
        </Field>
      </div>

      {/* Botų spąstai – žmonėms nematomas laukas */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="field-company">Įmonė</label>
        <input id="field-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
      </div>

      <div className="field field--check" data-invalid={touched.consent && errors.consent ? '' : undefined}>
        <label className="checkbox">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={update}
            onBlur={blur}
            aria-invalid={touched.consent && errors.consent ? true : undefined}
            aria-describedby={describe('consent')}
          />
          <span>
            Sutinku, kad mano duomenys būtų naudojami atsakant į užklausą.{' '}
            <a href="/privatumo-politika">Privatumo politika</a>
          </span>
        </label>
        {touched.consent && errors.consent && (
          <p className="field__error" id="field-consent-error">
            {errors.consent}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Siunčiama…' : 'Siųsti užklausą'}
      </button>
      {status === 'error' && (
        <p className="form-error" role="alert">
          Nepavyko išsiųsti. Bandykite dar kartą arba paskambinkite {COMPANY.phone}.
        </p>
      )}
    </form>
  )
}

function Contact() {
  return (
    <section id="kontaktai" className="section" aria-labelledby="kontaktai-title">
      <div className="container">
        <SectionHead
          id="kontaktai-title"
          eyebrow="Kontaktai"
          title="Papasakokite apie savo projektą"
          lede="Užpildykite formą arba paskambinkite – atsakome per 1 darbo dieną. Konsultacija ir sąmata nemokamos."
        />
        <div className="contact">
          <div className="reveal">
            <ContactForm />
          </div>

          <aside className="contact__info reveal" aria-label="Kontaktinė informacija">
            <ul className="contact-list">
              <li>
                <span className="icon-tile">
                  <Icon name="phone" size={20} />
                </span>
                <span>
                  <span className="contact-list__label">Telefonas</span>
                  <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                </span>
              </li>
              <li>
                <span className="icon-tile">
                  <Icon name="mail" size={20} />
                </span>
                <span>
                  <span className="contact-list__label">El. paštas</span>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </span>
              </li>
              <li>
                <span className="icon-tile">
                  <Icon name="pin" size={20} />
                </span>
                <span>
                  <span className="contact-list__label">Adresas</span>
                  <address>{COMPANY.address}</address>
                </span>
              </li>
            </ul>

            <div className="hours">
              <h3>Darbo laikas</h3>
              <dl>
                <div>
                  <dt>I–V</dt>
                  <dd>8:00–18:00</dd>
                </div>
                <div>
                  <dt>VI</dt>
                  <dd>9:00–14:00</dd>
                </div>
                <div>
                  <dt>VII</dt>
                  <dd>Nedirbame</dd>
                </div>
              </dl>
            </div>

            <div className="socials">
              <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook (atidaroma naujame lange)">
                <FacebookIcon />
              </a>
              <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram (atidaroma naujame lange)">
                <InstagramIcon />
              </a>
            </div>

            {/* TODO: pakeiskite į Google Maps <iframe src="https://www.google.com/maps/embed?pb=..." loading="lazy" title="Mūsų biuras žemėlapyje" /> */}
            <div className="map-placeholder" role="img" aria-label="Žemėlapio vieta (laikinas paveikslėlis)">
              <Icon name="pin" size={28} />
              <span>Čia bus Google Maps žemėlapis</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Poraštė                                                            */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo />
          <p>Statybos ir remonto darbai Vilniuje ir regione. Kokybė, už kurią atsakome.</p>
        </div>
        <nav aria-label="Greitosios nuorodos">
          <h2 className="site-footer__title">Nuorodos</h2>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="site-footer__title">Kontaktai</h2>
          <ul>
            <li>
              <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </li>
            <li>{COMPANY.address}</li>
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {COMPANY.name}. Visos teisės saugomos.
        </p>
        <a href="/privatumo-politika">Privatumo politika</a>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */

export default function App() {
  useReveal()
  return (
    <>
      <a href="#turinys" className="skip-link">
        Pereiti prie turinio
      </a>
      <div id="top" />
      <Header />
      <main id="turinys" tabIndex={-1}>
        <Hero />
        <Services />
        <About />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
