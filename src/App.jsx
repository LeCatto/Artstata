import { useEffect, useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
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
  hours: 'I–V 8:00–18:00',
}

// Jei tuščia – forma tik imituoja išsiuntimą. Įrašykite savo API / Formspree adresą.
const FORM_ENDPOINT = ''

const NAV = [
  { id: 'paslaugos', label: 'Paslaugos' },
  { id: 'samata', label: 'Skaičiuoklė' },
  { id: 'eiga', label: 'Darbų eiga' },
  { id: 'kontaktai', label: 'Kontaktai' },
]

/* ------------------------------------------------------------------ */
/*  Judesio kalba                                                      */
/*  Visos spyruoklės kritiškai slopintos (ζ ≈ 1): jokio peršokimo,      */
/*  bet perima greitį, kai vartotojas pertraukia animaciją.             */
/*  ζ = damping / (2·√(stiffness·mass))                                 */
/* ------------------------------------------------------------------ */

const SPRING = { type: 'spring', stiffness: 420, damping: 42, mass: 1 } // ζ≈1.02, ~0.31 s
const SPRING_LAYOUT = { type: 'spring', stiffness: 260, damping: 33, mass: 1 } // ζ≈1.02, ~0.39 s
const SPRING_NUMBER = { stiffness: 200, damping: 29, mass: 1 } // ζ≈1.03, ~0.44 s

/* ------------------------------------------------------------------ */
/*  Pagalbiniai                                                        */
/* ------------------------------------------------------------------ */

const eur = new Intl.NumberFormat('lt-LT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
const months = new Intl.NumberFormat('lt-LT', { maximumFractionDigits: 1 })

function useScrollSpy(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

/* Skaičius, kuris „nusėda“ spyruokle prie naujos reikšmės.
   Pertraukus (pvz., tempiant slankiklį) tęsia nuo dabartinės reikšmės ir greičio. */
function SpringNumber({ value, format }) {
  const reduce = useReducedMotion()
  const spring = useSpring(value, SPRING_NUMBER)
  const text = useTransform(spring, format)

  useEffect(() => {
    if (reduce) spring.jump(value)
    else spring.set(value)
  }, [value, reduce, spring])

  return (
    <motion.span className="num" aria-hidden="true">
      {text}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/*  Ženklas                                                            */
/* ------------------------------------------------------------------ */

function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 2118 2016" width="28" height="27" aria-hidden="true">
      <g
        transform="translate(0.000000,2016.000000) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        <path d="M10720 17929 c-382 -131 -886 -303 -1120 -383 -367 -125 -2290 -782
-2497 -853 l-73 -25 0 -1324 0 -1323 -852 286 -853 286 -1540 -515 c-847 -284
-1831 -614 -2187 -735 l-648 -218 -2 -5858 -3 -5857 3233 0 3232 0 0 6040 c0
3324 4 6040 9 6040 10 0 1879 -628 1892 -635 5 -4 9 -2259 9 -5726 l0 -5719
1520 0 1520 0 0 4805 c0 2643 2 4805 5 4805 4 0 651 177 2336 640 399 110 729
200 733 200 3 0 6 -2351 6 -5225 l0 -5225 1745 0 1745 0 0 4943 0 4942 -833
259 c-1377 429 -1892 590 -2089 651 l-188 58 -2 2205 -3 2205 -80 28 c-44 15
-417 143 -830 284 -412 141 -1123 384 -1580 540 -456 156 -1068 365 -1360 464
-291 100 -534 180 -540 180 -5 -1 -323 -109 -705 -240z m1362 -378 c354 -121
1005 -343 1448 -495 443 -151 1054 -359 1357 -463 l553 -188 -3 -2075 -2
-2074 -115 -32 c-142 -39 -2186 -604 -2850 -787 l-485 -134 -5 -4759 -5 -4759
-1137 -3 -1138 -2 -2 5672 -3 5672 -695 234 c-382 129 -896 302 -1142 384
l-448 150 -1 231 c-5 1401 -3 2270 6 2276 5 4 370 130 810 280 1068 364 1620
553 2475 845 393 135 720 245 727 246 6 0 301 -99 655 -219z m-5912 -3640
l855 -288 0 -5919 0 -5919 -2850 0 -2850 0 -2 5535 -3 5535 1563 523 c1411
473 2432 817 2432 820 0 1 385 -128 855 -287z m10269 -2237 c328 -102 745
-232 926 -288 182 -57 522 -163 758 -237 l427 -133 0 -4618 0 -4618 -1362 3
-1363 2 -3 5038 c-1 3744 1 5037 9 5037 7 0 280 -84 608 -186z"/>
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Navigacija                                                         */
/* ------------------------------------------------------------------ */

const NAV_IDS = NAV.map((n) => n.id)

function Header() {
  const headerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(NAV_IDS)

  // Krašto efektas tik tada, kai turinys iš tiesų slenka po juosta.
  // Rašome tiesiai į DOM, be perpiešimo kiekvienam slinkimo įvykiui.
  useEffect(() => {
    const el = headerRef.current
    const onScroll = () => el.toggleAttribute('data-scrolled', window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 760 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header ref={headerRef} className="nav">
      <div className="nav__inner">
        <a href="#top" className="brand" aria-label={`${COMPANY.name}: grįžti į pradžią`}>
          <BrandMark />
          <span className="brand__name">{COMPANY.name}</span>
          <span className="brand__sub">Rangos darbai</span>
        </a>

        <nav className="nav__links" aria-label="Pagrindinė navigacija">
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={active === n.id ? 'location' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <a href="#kontaktai" className="btn btn--primary btn--sm">
            Gauti sąmatą
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__toggle-bar" />
            <span className="nav__toggle-bar" />
          </button>
        </div>
      </div>

      <nav id="mobile-menu" className="nav__sheet" data-open={open || undefined} aria-label="Mobilioji navigacija" inert={!open}>
        <ul>
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

/* Namo pjūvis su matmenimis. Mastelis: 80 px = 3 000 mm. */
function SectionDrawing() {
  const hatchId = useId()
  return (
    <svg className="drawing" viewBox="0 0 520 440" role="img" aria-labelledby={`${hatchId}-t`}>
      <title id={`${hatchId}-t`}>Dviejų aukštų gyvenamojo namo pjūvio brėžinys su matmenimis</title>
      <defs>
        <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Gruntas ir pamatai */}
      <g className="drawing__fill">
        <rect x="92" y="360" width="336" height="34" fill={`url(#${hatchId})`} />
        <rect x="100" y="200" width="12" height="160" fill={`url(#${hatchId})`} />
        <rect x="408" y="200" width="12" height="160" fill={`url(#${hatchId})`} />
      </g>

      <g className="drawing__lines drawing__lines--1" fill="none">
        <path pathLength="1" d="M20 360H500" />
        <path pathLength="1" d="M92 360V394H428V360" />
        <path pathLength="1" d="M100 352H420V360H100Z" />
      </g>

      <g className="drawing__lines drawing__lines--2" fill="none">
        <path pathLength="1" d="M100 352V200H112V352" />
        <path pathLength="1" d="M420 352V200H408V352" />
        <path pathLength="1" d="M112 272H408V280H112" />
      </g>

      <g className="drawing__lines drawing__lines--3" fill="none">
        <path pathLength="1" d="M80 208L260 92L440 208" />
        <path pathLength="1" d="M100 200L260 104L420 200" />
        <path pathLength="1" d="M150 312H190V342H150Z" />
        <path pathLength="1" d="M330 312H370V342H330Z" />
        <path pathLength="1" d="M150 226H190V256H150Z" />
        <path pathLength="1" d="M330 226H370V256H330Z" />
        <path pathLength="1" d="M246 292H274V352" />
      </g>

      {/* Matmenų linijos */}
      <g className="drawing__dims" fill="none">
        <path pathLength="1" d="M100 418H420M100 410V426M420 410V426" />
        <path pathLength="1" d="M95 414L105 422M415 414L425 422" />
        <path pathLength="1" d="M52 352V200M44 352H60M44 200H60" />
        <path pathLength="1" d="M48 356L56 348M48 204L56 196" />
      </g>

      <g className="drawing__labels">
        <text x="260" y="436" textAnchor="middle">12 000</text>
        <text x="40" y="280" textAnchor="middle" transform="rotate(-90 40 280)">5 700</text>

        <g className="drawing__level">
          <path d="M446 352l6-8h-12z" className="drawing__level-mark" />
          <path d="M440 352H500" fill="none" />
          <text x="458" y="346">±0,000</text>
        </g>
        <g className="drawing__level">
          <path d="M446 272l6-8h-12z" />
          <path d="M440 272H500" fill="none" />
          <text x="458" y="266">+3,000</text>
        </g>
        <g className="drawing__level">
          <path d="M276 92l6-8h-12z" />
          <path d="M270 92H330" fill="none" />
          <text x="288" y="86">+9,825</text>
        </g>
      </g>
    </svg>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title" className="display hero__title">
          Statyba ir vidaus apdaila nuo pamato iki rakto
        </h1>
        <p className="lede hero__lede">
          Kaina ir terminai įrašomi į sutartį dar prieš pradedant darbus.
        </p>
        <div className="hero__ctas">
          <a href="#samata" className="btn btn--primary">
            Apskaičiuoti kainą
          </a>
          <a href="#kontaktai" className="btn btn--quiet">
            Objekto apžiūra
          </a>
        </div>
      </div>

      <figure className="hero__sheet">
        <SectionDrawing />
        <figcaption>
          <span>Gyvenamasis namas, pjūvis 1–1</span>
          <span className="num">M 1:100</span>
        </figcaption>
      </figure>

      <dl className="hero__facts">
        <div>
          <dt>garantija konstrukcijoms</dt>
          <dd className="num">10 m.</dd>
        </div>
        <div>
          <dt>užbaigtų objektų</dt>
          <dd className="num">120+</dd>
        </div>
        <div>
          <dt>apžiūra ir sąmata</dt>
          <dd className="num">0 €</dd>
        </div>
      </dl>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Paslaugos                                                          */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    id: 'statyba',
    title: 'Gyvenamoji statyba',
    short: 'Individualūs namai ir kotedžai',
    text: 'Statome mūrinius ir karkasinius namus pagal jūsų projektą: nuo geologinių tyrinėjimų ir pamatų iki stogo, fasado ir sklypo sutvarkymo.',
    scope: ['Pamatai ir hidroizoliacija', 'Mūro ir karkaso konstrukcijos', 'Stogo ir fasado darbai', 'Langų ir lauko durų montavimas'],
    term: 'nuo 6 mėn.',
  },
  {
    id: 'apdaila',
    title: 'Pilna vidaus apdaila',
    short: 'Namai, butai ir biurai',
    text: 'Nuo tinko ir grindų išlyginimo iki paskutinės grindjuostės. Medžiagas parenkame kartu ir užsakome patys, kad jos atkeliautų laiku.',
    scope: ['Tinkavimas ir glaistymas', 'Grindų dangos ir plytelės', 'Vonios ir virtuvės įrengimas', 'Vidaus durys ir laiptai'],
    term: 'nuo 6 sav.',
  },
  {
    id: 'inzinerija',
    title: 'Inžinerinės sistemos',
    short: 'Šildymas, vėdinimas, elektra',
    text: 'Šildymą, vėdinimą, vandentiekį ir elektrą projektuojame ir montuojame kaip vieną sistemą, todėl jos suderintos tarpusavyje ir nereikia derinti kelių rangovų.',
    scope: ['Šilumos siurbliai ir grindinis šildymas', 'Rekuperacinis vėdinimas', 'Vandentiekis ir nuotekos', 'Elektros instaliacija ir apšvietimas'],
    term: 'nuo 3 sav.',
  },
  {
    id: 'valdymas',
    title: 'Projektų valdymas',
    short: 'Vienas atsakingas vadovas',
    text: 'Projekto vadovas sudaro darbų grafiką, kontroliuoja biudžetą ir subrangovus, o jūs kas savaitę gaunate ataskaitą su nuotraukomis.',
    scope: ['Darbų grafikas ir biudžeto kontrolė', 'Medžiagų tiekimo logistika', 'Leidimai ir statybos dokumentacija', 'Savaitinės ataskaitos'],
    term: 'visam projektui',
  },
]

function Services() {
  const [active, setActive] = useState(SERVICES[0].id)

  return (
    <section id="paslaugos" className="section" aria-labelledby="paslaugos-title">
      <div className="section__head">
        <h2 id="paslaugos-title" className="title">
          Vienas rangovas visam objektui
        </h2>
        <p className="lede">
          Galite užsakyti vieną darbų etapą arba visą objektą. Kai darbus atlieka viena komanda,
          nereikia derinti kelių rangovų ir ieškoti, kas atsakingas už klaidas.
        </p>
      </div>

      <LayoutGroup>
        <ul className="svc">
          {SERVICES.map((s) => {
            const isActive = s.id === active
            return (
              <motion.li
                key={s.id}
                layout
                transition={SPRING_LAYOUT}
                className="svc__card"
                data-active={isActive || undefined}
                style={{ borderRadius: 4 }}
              >
                {/* Mygtukas turi savo :active mastelį, todėl layout korekcija – vidiniame elemente */}
                <button
                  type="button"
                  className="svc__trigger"
                  aria-expanded={isActive}
                  aria-controls={`svc-${s.id}`}
                  onClick={() => setActive(s.id)}
                >
                  <motion.span layout="position" transition={SPRING_LAYOUT} className="svc__heading">
                    <span className="svc__title">{s.title}</span>
                    <span className="svc__short">{s.short}</span>
                  </motion.span>
                </button>

                <AnimatePresence initial={false} mode="popLayout">
                  {isActive && (
                    <motion.div
                      key="body"
                      layout="position"
                      transition={SPRING_LAYOUT}
                      id={`svc-${s.id}`}
                      className="svc__body"
                      initial={{ opacity: 0, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.24, delay: 0.08, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } }}
                    >
                      <p>{s.text}</p>
                      <ul className="svc__scope">
                        {s.scope.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="svc__term">
                        Įprasta trukmė: <strong>{s.term}</strong>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </LayoutGroup>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Skaičiuoklė                                                        */
/* ------------------------------------------------------------------ */

const PROPERTY_TYPES = [
  { value: 'namas', label: 'Namas', min: 80, max: 400, step: 5, initial: 160, unitLabel: 'Namo statyba su apdaila' },
  { value: 'butas', label: 'Butas', min: 30, max: 250, step: 1, initial: 75, unitLabel: 'Buto vidaus apdaila' },
  { value: 'komercines', label: 'Komercinės patalpos', min: 50, max: 1200, step: 10, initial: 250, unitLabel: 'Patalpų įrengimas' },
]

const QUALITIES = [
  {
    value: 'daline',
    label: 'Dalinė',
    scope: 'Tinkas, grindų išlyginimas, elektros, vandentiekio ir šildymo instaliacija. Patalpos paruoštos galutinei apdailai.',
  },
  {
    value: 'standartine',
    label: 'Standartinė',
    scope: 'Dalinė apdaila ir dažymas, grindų dangos, plytelės, vidaus durys bei santechnika iš patikrintų vidutinės klasės gamintojų.',
  },
  {
    value: 'premium',
    label: 'Premium',
    scope: 'Individualūs sprendimai: natūralus akmuo ir medis, paslėptos durų staktos, išmaniojo namo valdymas, architekto priežiūra.',
  },
]

// Orientaciniai įkainiai, € / m² be PVM. TODO: suderinkite su savo kainynu.
const RATES = {
  namas: { daline: 1050, standartine: 1350, premium: 1850 },
  butas: { daline: 220, standartine: 420, premium: 720 },
  komercines: { daline: 260, standartine: 450, premium: 780 },
}

// Trukmė savaitėmis: bazė + plotas × koeficientas + priedas už apdailos lygį.
const DURATION = {
  namas: { base: 18, perM2: 0.08, quality: { daline: 0, standartine: 6, premium: 12 } },
  butas: { base: 4, perM2: 0.07, quality: { daline: 0, standartine: 3, premium: 6 } },
  komercines: { base: 4, perM2: 0.03, quality: { daline: 0, standartine: 3, premium: 6 } },
}

function estimate(type, area, quality) {
  const rate = RATES[type][quality]
  const d = DURATION[type]
  const weeks = d.base + area * d.perM2 + d.quality[quality]
  return {
    rate,
    low: Math.round((area * rate * 0.92) / 500) * 500,
    high: Math.round((area * rate * 1.08) / 500) * 500,
    months: Math.max(1, Math.round((weeks / 4.345) * 2) / 2),
  }
}

const formatEur = (v) => eur.format(Math.round(v / 100) * 100)
const formatMonths = (v) => months.format(Math.round(v * 2) / 2)

function Segmented({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="seg">
      <legend className="field-label">{legend}</legend>
      <div className="seg__track" style={{ '--count': options.length }}>
        {options.map((o) => {
          const checked = o.value === value
          return (
            <label key={o.value} className="seg__option" data-checked={checked || undefined}>
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
              />
              {checked && <motion.span layoutId={`${name}-thumb`} className="seg__thumb" transition={SPRING} />}
              <span className="seg__text">{o.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function AreaSlider({ min, max, step, value, onChange }) {
  const id = useId()
  const t = (value - min) / (max - min)
  return (
    <div className="area">
      <div className="area__head">
        <label htmlFor={id} className="field-label">
          Plotas
        </label>
        <output htmlFor={id} className="area__value num">
          {value} m²
        </output>
      </div>

      {/* Matmens linija: tempiant seka slankiklį 1:1, be animacijos */}
      <div className="area__dim" aria-hidden="true">
        <span className="area__dim-line" style={{ transform: `scaleX(${t})` }} />
        <span className="area__dim-end" style={{ transform: `translateX(${t * 100}%)` }}>
          <span />
        </span>
      </div>

      <input
        id={id}
        type="range"
        className="area__input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} kvadratinių metrų`}
      />
      <div className="area__scale num" aria-hidden="true">
        <span>{min} m²</span>
        <span>{max} m²</span>
      </div>
    </div>
  )
}

function Estimator({ onRequest }) {
  const [type, setType] = useState('namas')
  const [quality, setQuality] = useState('standartine')
  const [area, setArea] = useState(PROPERTY_TYPES[0].initial)

  const typeDef = PROPERTY_TYPES.find((p) => p.value === type)
  const qualityDef = QUALITIES.find((q) => q.value === quality)
  const result = estimate(type, area, quality)

  const changeType = (next) => {
    setType(next)
    setArea(PROPERTY_TYPES.find((p) => p.value === next).initial)
  }

  const request = () => {
    onRequest({
      service: type === 'namas' ? 'statyba' : 'apdaila',
      message: `${typeDef.unitLabel}, ${area} m², ${qualityDef.label.toLowerCase()} apdaila. Skaičiuoklės įvertis: ${formatEur(result.low)} – ${formatEur(result.high)}.`,
    })
  }

  return (
    <section id="samata" className="slab" aria-labelledby="samata-title">
      <div className="slab__inner">
        <div className="section__head section__head--dark">
          <h2 id="samata-title" className="title">
            Preliminari kaina per minutę
          </h2>
          <p className="lede">
            Skaičiuoklė remiasi praėjusių metų objektų vidurkiais. Tikslią sąmatą parengiame
            nemokamai po objekto apžiūros ir užfiksuojame ją sutartyje.
          </p>
        </div>

        <div className="est">
          <div className="est__controls">
            <Segmented name="type" legend="Objekto tipas" options={PROPERTY_TYPES} value={type} onChange={changeType} />
            <AreaSlider
              key={type}
              min={typeDef.min}
              max={typeDef.max}
              step={typeDef.step}
              value={area}
              onChange={setArea}
            />
            <Segmented name="quality" legend="Apdailos lygis" options={QUALITIES} value={quality} onChange={setQuality} />
            <p className="est__scope">{qualityDef.scope}</p>
          </div>

          <div className="est__result">
            <p className="est__label">{typeDef.unitLabel}</p>
            <p className="est__price">
              <SpringNumber value={result.low} format={formatEur} />
              <span className="est__dash" aria-hidden="true">–</span>
              <SpringNumber value={result.high} format={formatEur} />
            </p>
            <dl className="est__meta">
              <div>
                <dt>Trukmė</dt>
                <dd>
                  <SpringNumber value={result.months} format={formatMonths} /> mėn.
                </dd>
              </div>
              <div>
                <dt>Įkainis</dt>
                <dd className="num">{eur.format(result.rate)} / m²</dd>
              </div>
            </dl>
            <output className="sr-only" aria-live="polite">
              {`${formatEur(result.low)} – ${formatEur(result.high)}, apie ${formatMonths(result.months)} mėn.`}
            </output>
            <p className="est__note">Kainos be PVM. Įvertis nėra komercinis pasiūlymas.</p>
            <a href="#kontaktai" className="btn btn--primary btn--block" onClick={request}>
              Gauti tikslią sąmatą
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Darbų eiga                                                         */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: 'Sąmatos fiksavimas',
    text: 'Apžiūrime objektą, sutikriname projektą ir parengiame sąmatą pagal darbų kiekius. Jei projekto nekeičiate, kaina nesikeičia.',
    time: '3–5 darbo d.',
  },
  {
    title: 'Sutartis',
    text: 'Sutartyje įrašome kainą, kiekvieno etapo terminą, mokėjimų grafiką ir garantijos sąlygas. Mokate tik už priimtus etapus.',
    time: '1 susitikimas',
  },
  {
    title: 'Statybos etapai',
    text: 'Projekto vadovas kas savaitę siunčia ataskaitą su nuotraukomis. Kiekvieną etapą priimate pasirašydami priėmimo aktą.',
    time: 'pagal grafiką',
  },
  {
    title: 'Raktų perdavimas',
    text: 'Perduodame objektą su išpildomąja dokumentacija, garantiniais raštais ir įrangos naudojimo instrukcijomis.',
    time: 'paskutinė diena',
  },
]

function Process() {
  return (
    <section id="eiga" className="section" aria-labelledby="eiga-title">
      <div className="section__head">
        <h2 id="eiga-title" className="title">
          Keturi etapai, kurių kiekvienas baigiasi parašu
        </h2>
        <p className="lede">
          Visada žinote, kas vyksta objekte, kiek tai kainuoja ir kada bus baigta.
        </p>
      </div>

      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="step">
            <span className="step__index num" aria-hidden="true">
              {i + 1}
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <p className="step__time">{s.time}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Kontaktai                                                          */
/* ------------------------------------------------------------------ */

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ value: s.id, label: s.title })),
  { value: 'kita', label: 'Kita' },
]

const EMPTY_FORM = { name: '', phone: '', city: '', service: '', message: '', company: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Įveskite savo vardą.'
  const digits = v.phone.replace(/[\s()-]/g, '')
  if (!digits) e.phone = 'Įveskite telefono numerį.'
  else if (!/^(\+3706\d{7}|86\d{7}|\+?\d{9,15})$/.test(digits))
    e.phone = 'Patikrinkite numerį, pvz., +370 600 00000.'
  if (v.city.trim().length < 2) e.city = 'Nurodykite, kuriame mieste yra objektas.'
  if (!v.service) e.service = 'Pasirinkite paslaugą.'
  return e
}

function Field({ id, label, optional, error, children }) {
  return (
    <div className="field" data-invalid={error ? '' : undefined}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="field__optional"> (neprivaloma)</span>}
      </label>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm({ draft }) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [appliedDraft, setAppliedDraft] = useState(null)
  const formRef = useRef(null)
  const errors = validate(values)

  // Perkeliame skaičiuoklės pasirinkimą į formą, neperrašydami to, ką žmogus jau įvedė.
  if (draft && draft !== appliedDraft) {
    setAppliedDraft(draft)
    setStatus('idle')
    setValues((v) => ({
      ...v,
      service: v.service || draft.service,
      message: v.message.trim() ? v.message : draft.message,
    }))
  }

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  const errorFor = (name) => (touched[name] ? errors[name] : undefined)
  const common = (name) => ({
    id: `field-${name}`,
    name,
    value: values[name],
    onChange: update,
    onBlur: blur,
    'aria-invalid': errorFor(name) ? true : undefined,
    'aria-describedby': errorFor(name) ? `field-${name}-error` : undefined,
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (values.company) return // botų spąstai
    setTouched(Object.fromEntries(Object.keys(EMPTY_FORM).map((k) => [k, true])))
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
      <div className="form form--done" role="status">
        <h3>Ačiū, užklausą gavome</h3>
        <p>
          Paskambinsime per vieną darbo dieną ir suderinsime objekto apžiūros laiką. Skubu? Skambinkite{' '}
          <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>.
        </p>
        <button type="button" className="btn btn--quiet" onClick={() => setStatus('idle')}>
          Siųsti kitą užklausą
        </button>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit} aria-labelledby="form-title">
      <h3 id="form-title">Užklausa sąmatai</h3>

      <div className="form__grid">
        <Field id="field-name" label="Vardas" error={errorFor('name')}>
          <input {...common('name')} type="text" autoComplete="given-name" required />
        </Field>
        <Field id="field-phone" label="Telefonas" error={errorFor('phone')}>
          <input {...common('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+370" required />
        </Field>
        <Field id="field-city" label="Miestas" error={errorFor('city')}>
          <input {...common('city')} type="text" autoComplete="address-level2" required />
        </Field>
        <Field id="field-service" label="Paslaugos tipas" error={errorFor('service')}>
          <select {...common('service')} required>
            <option value="" disabled>
              Pasirinkite
            </option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="form__wide">
          <Field id="field-message" label="Žinutė" optional>
            <textarea
              {...common('message')}
              rows={4}
              placeholder="Objekto adresas, plotas, pageidaujama pradžia"
            />
          </Field>
        </div>
      </div>

      {/* Botų spąstai – žmonėms nematomas laukas */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="field-company">Įmonė</label>
        <input id="field-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
      </div>

      {status === 'error' && (
        <p className="form__alert" role="alert">
          Nepavyko išsiųsti. Pabandykite dar kartą arba skambinkite {COMPANY.phone}.
        </p>
      )}

      <div className="form__footer">
        <button type="submit" className="btn btn--primary" disabled={sending} aria-busy={sending || undefined}>
          {sending ? 'Siunčiama…' : 'Siųsti užklausą'}
        </button>
        <p className="form__privacy">
          Jūsų duomenis naudosime tik atsakymui į šią užklausą.
        </p>
      </div>
    </form>
  )
}

function Contact({ draft }) {
  return (
    <section id="kontaktai" className="section contact" aria-labelledby="kontaktai-title">
      <div className="contact__info">
        <h2 id="kontaktai-title" className="title">
          Aptarkime jūsų objektą
        </h2>
        <p className="lede">
          Atsakome per vieną darbo dieną. Objekto apžiūra ir sąmata – nemokamos.
        </p>

        <dl className="contact__list">
          <div>
            <dt>Telefonas</dt>
            <dd>
              <a href={COMPANY.phoneHref} className="contact__big num">
                {COMPANY.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt>El. paštas</dt>
            <dd>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </dd>
          </div>
          <div>
            <dt>Biuras</dt>
            <dd>
              <address>{COMPANY.address}</address>
            </dd>
          </div>
          <div>
            <dt>Darbo laikas</dt>
            <dd className="num">{COMPANY.hours}</dd>
          </div>
        </dl>
      </div>

      <ContactForm draft={draft} />
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          <strong>{COMPANY.name}</strong> | Rangos darbai
        </p>
        <p className="num">© {new Date().getFullYear()} {COMPANY.name}. Visos teisės saugomos.</p>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  Puslapis                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [draft, setDraft] = useState(null)

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Pereiti prie turinio
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Services />
        <Estimator onRequest={setDraft} />
        <Process />
        <Contact draft={draft} />
      </main>
      <Footer />
    </MotionConfig>
  )
}
