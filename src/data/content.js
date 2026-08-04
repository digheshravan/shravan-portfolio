/**
 * Single source of truth for everything on the page.
 * Mirrors Shravan_CV 1.pdf — update here, the whole site follows.
 */

export const PROFILE = {
  first: 'Shravan',
  last: 'Dige',
  role: 'Computer Engineer',
  tagline: 'I design and ship full-stack web and cross-platform mobile products.',
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
    'Computer Engineering student at NMIMS Mumbai with hands-on experience designing and delivering full-stack web and cross-platform mobile applications. Skilled in Flutter, Spring Boot and Angular, with a solid understanding of backend APIs, database design and UI/UX principles. Pursuing an MBA Tech degree to bridge technology with business strategy, with a passion for building intuitive, scalable and impactful digital products.',
}

export const STATS = [
  { value: '2028', label: 'MBA Tech, NMIMS' },
  { value: '02', label: 'Flagship builds' },
  { value: '04', label: 'Stacks in production' },
  { value: 'SIH', label: "'25 selected" },
]

export const MARQUEE = [
  'Flutter',
  'Spring Boot',
  'Angular',
  'Supabase',
  'REST APIs',
  'MySQL',
  'Figma',
  'Dart',
  'Java',
]

export const SKILLS = [
  {
    id: '01',
    group: 'Languages',
    blurb: 'The grammar I think in — typed, compiled, and on the wire.',
    items: ['Java', 'Dart', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    id: '02',
    group: 'Frameworks',
    blurb: 'From a single Dart codebase to a JWT-secured service layer.',
    items: ['Flutter', 'Spring Boot', 'Angular', 'REST APIs'],
  },
  {
    id: '03',
    group: 'Databases',
    blurb: 'Normalised schemas, row-level security, real-time subscriptions.',
    items: ['MySQL', 'Supabase', 'PostgreSQL'],
  },
  {
    id: '04',
    group: 'Tools & Design',
    blurb: 'Certified in UI/UX — I ship the interface, not just the endpoint.',
    items: ['Figma', 'Git', 'GitHub', 'Android Studio', 'VS Code', 'Postman'],
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
    metrics: [
      { k: 'Architecture', v: 'SPA + REST' },
      { k: 'Auth', v: 'JWT' },
      { k: 'Roles', v: 'Admin · Customer' },
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
  { label: 'About', href: '#about' },
  { label: 'Craft', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Path', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]
