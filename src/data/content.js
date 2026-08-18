/**
 * Single source of truth for everything on the page.
 * Mirrors Shravan_CV_MIP.pdf — update here, the whole site follows.
 *
 * DOB and CGPA exist on the source CV and stay off this file, and off the
 * site, by decision — see PRODUCT.md "Capabilities and Constraints".
 */

export const PROFILE = {
  first: 'Shravan',
  last: 'Dige',
  role: 'Software & AI Engineer',
  tagline:
    'I build AI-powered software — RAG pipelines, LLM tooling and full-stack products — from the data layer up to the interface.',
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
    "I'm an MBA Tech student at NMIMS Mumbai, pairing Computer Engineering with a management stream in Business, IT & Analytics. I started with a diploma before the degree, so the keyboard came before the theory. The pattern across what I've built since — a RAG assistant shipped professionally at a startup, a document-intelligence platform, and now an LLM pipeline reading IPO filings the way an analyst would — is software that reads and reasons over real documents. That intersection, engineering meeting generative AI meeting the data and finance literacy the management stream teaches, is where I'm taking the work next.",
}

export const STATS = [
  { value: '04', label: 'Products built' },
  { value: '04', label: 'Domains in play' },
  { value: 'SIH', label: "'25 college round" },
  { value: '2028', label: 'MBA Tech, NMIMS' },
]

export const MARQUEE = [
  'Generative AI',
  'RAG',
  'Python',
  'Flutter',
  'Spring Boot',
  'Angular',
  'Google Gemini',
  'Groq · Llama 3.3',
  'REST APIs',
  'Data Analysis',
]

/**
 * The four fronts the whole site is organised around — mapped directly to
 * the CV's Core Skills groupings rather than invented separately.
 *
 * `status` is deliberately honest: three of these are shipping today, one —
 * the data/finance side of the MBA Tech management stream — is newer and
 * marked as such. A student who marks the difference reads as self-aware;
 * one who claims mastery of everything reads as unverified, and recruiters
 * check.
 */
export const FOCUS = [
  {
    id: '01',
    title: 'Software engineering',
    status: 'Shipping',
    tone: 'live',
    blurb:
      'Full-stack, end to end — a typed backend, a normalised schema, and an interface worth using, on every product I ship.',
    evidence: [
      'Spring Boot REST APIs behind Angular and React frontends',
      'Normalised MySQL / PostgreSQL schemas, not denormalised shortcuts',
      'This portfolio: React, Three.js and custom GLSL, hand-built',
    ],
    stack: ['Java', 'Python', 'React', 'Angular', 'Spring Boot', 'REST APIs'],
  },
  {
    id: '02',
    title: 'AI & generative systems',
    status: 'Shipping',
    tone: 'live',
    blurb:
      'Wiring real models into real products — grounded retrieval over improvisation, and the failure modes designed for rather than hoped away.',
    evidence: [
      'PetPal AI: a RAG pipeline shipped professionally over an 8-week technical internship',
      'DocMind: dual RAG modules for legal contract analysis and academic research synthesis',
      'IPO Prospectus Risk Decoder: an LLM pipeline reading regulatory filings for understated risk',
    ],
    stack: ['Generative AI', 'RAG', 'Groq · Llama 3.3', 'Google Gemini', 'Prompt design'],
  },
  {
    id: '03',
    title: 'Mobile product engineering',
    status: 'Shipping',
    tone: 'live',
    blurb:
      'One Dart codebase, both platforms. Cross-platform is only worth it if the result does not feel ported — so it does not.',
    evidence: [
      'MediSlot: location-aware doctor discovery with real-time appointment sync',
      'PetPal AI: health tracking, reminders and a GPS service directory',
      'Row-level security and multi-role auth enforced at the database layer',
    ],
    stack: ['Flutter', 'Dart', 'Supabase', 'Firebase'],
  },
  {
    id: '04',
    title: 'Data & finance technology',
    status: 'Going deeper',
    tone: 'learning',
    blurb:
      "The half of the MBA Tech degree that isn't engineering — where a product decision gets priced, not just shipped.",
    evidence: [
      'Bloomberg Market Concepts, Finance Fundamentals and Spreadsheet Analysis, 2026',
      'SQL and data analysis / visualisation across coursework and project work',
      'IPO Prospectus Risk Decoder applies this directly: risk scoring over financial filings',
    ],
    stack: ['SQL', 'Data Analysis', 'Visualisation', 'Bloomberg'],
  },
]

/** Grouped by the four fronts above rather than by "languages / frameworks",
 *  so the list answers what I can be handed rather than what I have read. */
export const SKILLS = [
  {
    id: '01',
    group: 'Software engineering',
    blurb: 'Typed services, normalised schemas, and interfaces worth using.',
    items: ['Java', 'Python', 'React', 'Angular', 'Spring Boot', 'REST APIs', 'Git & GitHub'],
  },
  {
    id: '02',
    group: 'AI & generative systems',
    blurb: 'Models wired into products, with retrieval and failure modes designed for.',
    items: ['Artificial Intelligence & ML', 'Generative AI & RAG', 'LLM applications', 'Document intelligence'],
  },
  {
    id: '03',
    group: 'Mobile',
    blurb: 'One Dart codebase, two platforms, no ported-feeling compromises.',
    items: ['Flutter', 'Dart', 'Firebase', 'Supabase'],
  },
  {
    id: '04',
    group: 'Data & finance',
    blurb: 'The management-stream half of the degree — SQL, analysis, and market literacy.',
    items: ['SQL', 'Data Analysis & Visualization', 'Bloomberg Market Concepts', 'Financial data'],
  },
]

export const PROJECTS = [
  {
    // Verified against the public repository README: FastAPI/SQLAlchemy
    // backend, React/Vite frontend, Groq-hosted Llama 3.3, ChromaDB — nothing
    // here is asserted beyond what the repo documents.
    id: '01',
    slug: 'docmind',
    flagship: true,
    title: 'DocMind — AI Document Intelligence',
    kind: 'AI application · document intelligence platform',
    year: '2026',
    device: 'docmind',
    pipeline: ['Document', 'Retrieval', 'Reasoning', 'Analysis'],
    summary:
      'A document-intelligence platform that reads contracts and research the way an analyst would — scoring risk, comparing versions, and citing exactly where an answer came from.',
    highlights: [
      'Legal Intelligence Suite: contract and lease risk analysis with clause-level classification and side-by-side document comparison',
      'Research Synthesizer cross-references up to 15 academic papers at once, surfacing contradictions and research gaps automatically',
      'RAG-powered chat assistants grounded in the uploaded documents for both the legal and research modes, not general model knowledge',
      'FastAPI + SQLAlchemy backend serving a React/Vite frontend, with Groq-hosted Llama 3.3 for sub-2-second inference',
      'ChromaDB vector store with local all-MiniLM-L6-v2 embeddings — semantic search that keeps the document off a third-party index',
    ],
    stack: ['FastAPI', 'React', 'Groq · Llama 3.3', 'ChromaDB', 'RAG', 'Python'],
    repo: 'https://github.com/digheshravan/DocMind',
    metrics: [
      { k: 'Inference', v: '<2s avg' },
      { k: 'Modules', v: 'Legal · Research' },
      { k: 'Papers', v: 'Up to 15' },
    ],
  },
  {
    // No public repository yet — CV-sourced only. Wording stays general and
    // the project is marked "In development" rather than implying it ships.
    id: '02',
    slug: 'ipo-risk-decoder',
    flagship: true,
    title: 'IPO Prospectus Risk Decoder',
    kind: 'LLM research build · financial document intelligence',
    stage: 'In development',
    year: '2026',
    device: 'riskdecoder',
    pipeline: ['DRHP', 'Extraction', 'Risk factors', 'Scoring', 'Benchmarking', 'Insights'],
    summary:
      'An LLM pipeline that reads IPO prospectuses the way a skeptical analyst would — extracting risk factors from dense filings, scoring their severity, and flagging language that looks softened rather than disclosed.',
    highlights: [
      'Parses DRHP (Draft Red Herring Prospectus) filings and extracts the risk factors stated in dense regulatory language',
      'Scores each risk factor and benchmarks it against comparable filings, so severity reads as relative rather than a raw label',
      'Flags disclosures that look obscured or understated rather than plainly stated — the pattern most retail readers miss',
      'Applies the same document-reasoning approach as DocMind to an adversarial reading problem: filings written to satisfy disclosure law with the least possible alarm',
    ],
    stack: ['LLM Analysis', 'Python', 'Risk Scoring', 'Document Parsing'],
    repo: null,
    metrics: [
      { k: 'Input', v: 'DRHP filings' },
      { k: 'Output', v: 'Risk score · benchmark' },
      { k: 'Stage', v: 'In development' },
    ],
  },
  {
    id: '03',
    slug: 'medislot',
    title: 'MediSlot — Doctor Appointment Application',
    kind: 'Cross-platform mobile application',
    year: '2025',
    device: 'phone',
    summary:
      'A cross-platform care app that makes doctor discovery, scheduling and management feel instant — nearby doctors, live slots, one tap to confirm.',
    highlights: [
      'Location-aware doctor discovery, surfacing nearby practitioners by specialty and distance',
      'Multi-role authentication separating Doctor and Patient journeys',
      'Doctors publish and manage live appointment slots; patients confirm in a single tap',
      'Row-level security policies enforced at the database layer via Supabase',
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
    id: '04',
    slug: 'car-rental',
    title: 'Car Rental Management System',
    kind: 'Full-stack web application',
    year: '2025',
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
]

/**
 * Professional experience. Sourced from the Technical Internship Program
 * report — every line here is in that document.
 *
 * Two things deliberately absent: no individual is named, and nothing
 * describes the employer's internal business strategy or any unresolved
 * issue in a product that is still theirs. Both are the owner's decisions,
 * recorded in PRODUCT.md.
 */
export const EXPERIENCE = [
  {
    id: '01',
    role: 'Flutter Developer',
    org: 'Tyrannix Pvt. Ltd.',
    orgNote: 'A Mumbai startup studio that designs and ships its own digital products.',
    kind: 'Technical Internship',
    period: '18 May — 11 July 2026',
    duration: '8 weeks',
    location: 'Mumbai, India',
    project: 'PetPal AI',
    summary:
      'Designed and built PetPal AI — a Pet Care Knowledge Portal & Intelligent Assistant grounded in verified articles rather than left to improvise.',
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
    note: 'A five-year integrated degree pairing core computer engineering with a management stream in Business, IT & Analytics.',
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
    year: '2026',
    title: 'Bloomberg Certifications',
    subtitle: 'Market Concepts · Finance Fundamentals · Spreadsheet Analysis',
    body: 'Three Bloomberg credentials covering market structure, financial fundamentals and spreadsheet-based analysis — the data/finance layer behind the MBA Tech management stream.',
    tag: 'Certification',
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
