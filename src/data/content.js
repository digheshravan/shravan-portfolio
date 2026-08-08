/**
 * Single source of truth for everything on the page.
 * Mirrors Shravan_CV 1.pdf — update here, the whole site follows.
 */

export const PROFILE = {
  first: 'Shravan',
  last: 'Dige',
  role: 'Software Engineer',
  tagline:
    'I build secure, AI-powered products for mobile and web — from the database schema up to the interface.',
  degree: 'MBA Tech — Computer Engineering',
  school: 'NMIMS Mumbai',
  cohort: 'Class of 2028',
  location: 'Mumbai, India',
  timezone: 'Asia/Kolkata',
  email: 'dighe.shravan2005@gmail.com',
  phone: '+91 85918 98527',
  phoneHref: '+918591898527',
  linkedin: 'https://www.linkedin.com/in/shravan-dige-655506234/',
  github: 'https://github.com/digheshravan',
  resume: '/Shravan-Dige-CV.pdf',
  statement:
    'I am a Computer Engineering student at NMIMS Mumbai who builds across four fronts: application security, AI-powered features, cross-platform mobile, and full-stack web. I started with a diploma before the degree, so the keyboard came before the theory — three shipped products later, the pattern I keep returning to is the boundary where a system trusts input it should not. Securing that boundary is where I am taking my work next.',
}

export const STATS = [
  { value: '03', label: 'Products shipped' },
  { value: '04', label: 'Domains in play' },
  { value: 'SIH', label: "'25 college round" },
  { value: '2028', label: 'MBA Tech, NMIMS' },
]

export const MARQUEE = [
  'Application security',
  'JWT',
  'Row-level security',
  'Google Gemini',
  'Flutter',
  'Spring Boot',
  'Angular',
  'Supabase',
  'Firebase',
  'REST APIs',
]

/**
 * The four fronts the whole site is organised around.
 *
 * `status` is deliberately honest: two of these are shipping, two are being
 * built toward. A student who marks the difference reads as self-aware; one who
 * claims mastery of everything reads as unverified — and recruiters check.
 */
export const FOCUS = [
  {
    id: '01',
    title: 'Application security',
    status: 'Going deeper',
    tone: 'learning',
    blurb:
      'Every product I have shipped enforces who may do what. That started as a requirement and became the part I find most interesting.',
    evidence: [
      'JWT-secured REST API across every protected endpoint',
      'Row-level security policies enforced in the database, not the client',
      'Role-based access separating Admin/Customer and Doctor/Patient journeys',
    ],
    stack: ['JWT', 'Row-level security', 'RBAC', 'Auth flows'],
  },
  {
    id: '02',
    title: 'AI-based applications',
    status: 'Shipping',
    tone: 'live',
    blurb:
      'Wiring real models into real products — where the interesting work is the failure modes, not the happy path.',
    evidence: [
      'PetPal AI: conversational assistant built on Google Gemini',
      'Firebase handling auth, persistence and live sync',
      'Reference content paired with free-form question answering',
    ],
    stack: ['Google Gemini', 'Firebase', 'Prompt design', 'REST'],
  },
  {
    id: '03',
    title: 'Mobile applications',
    status: 'Shipping',
    tone: 'live',
    blurb:
      'One Dart codebase, both platforms. Cross-platform is only worth it if the result does not feel ported — so it does not.',
    evidence: [
      'Three Flutter apps built and released to both platforms',
      'Real-time appointment sync with multi-role authentication',
      'Offline-tolerant flows and empty/error states designed, not skipped',
    ],
    stack: ['Flutter', 'Dart', 'Android Studio', 'iOS · Android'],
  },
  {
    id: '04',
    title: 'Web development',
    status: 'Shipping',
    tone: 'live',
    blurb:
      'Spring Boot services behind single-page frontends — and the occasional WebGL detour, like the site you are reading.',
    evidence: [
      'Angular SPA over a Spring Boot REST API, normalised MySQL schema',
      'End-to-end rental operations: inventory, bookings and billing',
      'This portfolio: React, Three.js and custom GLSL, scoring 60 fps',
    ],
    stack: ['Java', 'Spring Boot', 'Angular', 'React', 'MySQL'],
  },
]

/** Grouped by the four fronts above rather than by "languages / frameworks",
 *  so the list answers what I can be handed rather than what I have read. */
export const SKILLS = [
  {
    id: '01',
    group: 'Security',
    blurb: 'Guarding the boundary where a system trusts input it should not.',
    items: ['JWT', 'Row-level security', 'Role-based access', 'Auth flows', 'Input validation'],
  },
  {
    id: '02',
    group: 'AI & intelligence',
    blurb: 'Models wired into products, with the failure modes designed for.',
    items: ['Google Gemini', 'Firebase', 'Prompt design', 'API integration'],
  },
  {
    id: '03',
    group: 'Mobile',
    blurb: 'One Dart codebase, two platforms, no ported-feeling compromises.',
    items: ['Flutter', 'Dart', 'Android Studio', 'Cross-platform'],
  },
  {
    id: '04',
    group: 'Web & backend',
    blurb: 'Typed services, normalised schemas, and interfaces worth using.',
    items: ['Java', 'Spring Boot', 'Angular', 'React', 'MySQL', 'PostgreSQL', 'REST APIs'],
  },
]

export const PROJECTS = [
  {
    id: '01',
    slug: 'doctor-appointments',
    title: 'Doctor Appointment Booking',
    kind: 'Cross-platform mobile application',
    year: '2025',
    device: 'phone',
    summary:
      'A cross-platform app that makes doctor–patient scheduling feel instant. Two roles, one codebase, live sync.',
    highlights: [
      'Multi-role authentication separating Doctor and Patient journeys',
      'Doctors publish and manage appointment slots in real time',
      'Patients browse live availability and confirm in a single tap',
      'Row-level security policies enforced at the database layer',
    ],
    stack: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL'],
    repo: 'https://github.com/digheshravan/doctor-apppointment-application',
    metrics: [
      { k: 'Platforms', v: 'iOS · Android' },
      { k: 'Roles', v: 'Doctor · Patient' },
      { k: 'Sync', v: 'Realtime' },
    ],
  },
  {
    id: '02',
    slug: 'car-rental',
    title: 'Car Rental Management System',
    kind: 'Full-stack web application',
    year: '2024',
    device: 'browser',
    summary:
      'End-to-end rental operations — inventory, bookings and billing — behind role-based access control.',
    highlights: [
      'Spring Boot REST API secured with JWT authentication',
      'Angular single-page frontend with Admin and Customer routes',
      'Normalised MySQL schema for inventory, bookings and billing',
      'Role-based access control across every protected endpoint',
    ],
    stack: ['Angular', 'Spring Boot', 'MySQL', 'JWT'],
    repo: 'https://github.com/digheshravan/Car_Rental_System',
    metrics: [
      { k: 'Architecture', v: 'SPA + REST' },
      { k: 'Auth', v: 'JWT' },
      { k: 'Roles', v: 'Admin · Customer' },
    ],
  },
  {
    // Built professionally, at Tyrannix, during the technical internship — not a
    // side project. That distinction is the strongest single fact on the site.
    id: '03',
    slug: 'petpal-ai',
    title: 'PetPal AI',
    kind: 'AI application · built at Tyrannix',
    context: 'Technical internship',
    year: '2026',
    device: 'phone',
    summary:
      'A pet-care knowledge portal with a conversational assistant that answers from verified articles instead of improvising — built over an eight-week internship.',
    highlights: [
      'Retrieval-augmented generation over Gemini 2.5 Flash, grounding every answer in 50+ authored articles and citing its sources',
      'Keyword retrieval on Firestore ranked by relevance and species match, chosen over a vector database the corpus size did not justify',
      'Nine Firestore collections behind per-domain repository classes, keeping data access out of the presentation layer',
      'Clean data/domain/presentation layering in Flutter with Riverpod and GoRouter',
      'Health tracker with weight charts and scheduled vaccination reminders, plus a GPS service directory',
    ],
    stack: ['Flutter', 'Firebase', 'Gemini 2.5 Flash', 'RAG', 'Riverpod'],
    repo: 'https://github.com/digheshravan/Pet-Care-AI',
    metrics: [
      { k: 'Retrieval', v: 'RAG, cited' },
      { k: 'Corpus', v: '50+ articles' },
      { k: 'Collections', v: 'Nine' },
    ],
  },
]

/**
 * Professional experience. Sourced from the Technical Internship Program report
 * — every line here is in that document.
 *
 * Two things deliberately absent: no individual is named, and nothing describes
 * the employer's internal business strategy or any unresolved issue in a product
 * that is still theirs. Both are the owner's decisions, recorded in PRODUCT.md.
 */
export const EXPERIENCE = [
  {
    id: '01',
    role: 'Flutter Developer',
    org: 'Tyrannix Pvt. Ltd.',
    orgNote: 'A Mumbai startup studio that designs and ships its own digital products.',
    kind: 'Technical Internship',
    period: 'May — July 2026',
    duration: '8 weeks',
    location: 'Mumbai, India',
    project: 'PetPal AI',
    summary:
      'Designed and built PetPal AI — a pet-care knowledge portal with a conversational assistant grounded in verified articles rather than left to improvise.',
    highlights: [
      'Shipped a retrieval-augmented generation pipeline over Google Gemini 2.5 Flash, grounding every answer in 50+ authored articles and citing its sources',
      'Chose keyword retrieval on Firestore, ranked by relevance and species match, over introducing a vector database — the accuracy at this corpus size did not justify the extra infrastructure',
      'Modelled nine Firestore collections behind per-domain repository classes, keeping data access out of the presentation layer',
      'Structured the Flutter app in clean data, domain and presentation layers with Riverpod state management and GoRouter navigation',
      'Built pet profiles, a health tracker with weight charts and scheduled vaccination reminders, and a GPS service directory with distance sorting',
    ],
    stack: [
      'Flutter',
      'Dart',
      'Firebase',
      'Cloud Firestore',
      'Gemini 2.5 Flash',
      'RAG',
      'Riverpod',
      'Material 3',
    ],
  },
]

export const EDUCATION = [
  {
    year: '2024 — 2028',
    title: 'MBA Tech, Computer Engineering',
    org: 'Mukesh Patel School of Technology Management & Engineering',
    board: 'NMIMS Mumbai',
    note: 'A five-year integrated degree pairing core computer engineering with business strategy.',
    status: 'In progress',
  },
  {
    year: '2021 — 2024',
    title: 'Diploma, Computer Engineering',
    org: 'Pravin Patil College of Diploma Engineering & Technology',
    board: 'MSBTE',
    note: 'Foundations in programming, databases and software engineering practice.',
    status: 'Completed',
  },
  {
    year: '2020 — 2021',
    title: 'SSC, Class X',
    org: 'Sardar Vallabhbhai Patel Vidyalaya',
    board: 'MSBSHSE',
    note: 'Where the first line of code happened.',
    status: 'Completed',
  },
]

export const RECOGNITION = [
  {
    year: '2025',
    title: 'Smart India Hackathon',
    subtitle: 'Selected at College Level — Round 1',
    body: 'Competed among top national student innovators building technology-driven solutions to real-world problems. 27 September 2025.',
    tag: 'Hackathon',
  },
  {
    year: '2022',
    title: 'UI/UX Design Certification',
    subtitle: 'Six-week intensive programme',
    body: 'UI/UX fundamentals, Figma, design systems, responsive web and app design, closing with a hands-on capstone project.',
    tag: 'Certification',
  },
]

export const NAV = [
  { label: 'Index', href: '#hero' },
  { label: 'Focus', href: '#focus' },
  { label: 'About', href: '#about' },
  { label: 'Craft', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Path', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]
