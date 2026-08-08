# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — hiring contacts, India first.** Recruiters, engineering managers and campus-placement contacts at Indian companies (Mumbai, Bangalore, Pune), with international and remote-first companies as the secondary ambition. The page has to work for both without hedging into vagueness. They arrive from a CV link, a LinkedIn profile or a shared URL, often on a phone between other things, and they verify: a claim on the page is checked against GitHub within the first minute.

**Secondary — the public record.** Peers, collaborators, hackathon teams and anyone who lands on the site because Shravan sent it. This audience is explicitly in scope: the owner wants his work displayed publicly, in full, not curated down to a hiring funnel.

## Product Purpose

A complete personal portfolio for Shravan Dige — a full account of who he is and everything he has built — delivered as a genuinely good 3D web experience.

It exists to do three things at once: be a complete public record of his work, present that work well enough that it earns attention on its own, and be finished before his internship starts. Success is that someone can arrive knowing nothing, leave understanding what he builds and how he thinks, and find nothing on the page they cannot verify themselves.

## Positioning

A student engineer who ships whole products, across four fronts: **application security, AI-based applications, mobile applications, and web development.**

The strongest differentiator is no longer the breadth — it is that the AI work is **professional, not academic**. PetPal AI was built as a Flutter Developer at Tyrannix Pvt. Ltd. over an eight-week technical internship: a production-oriented app with a real RAG pipeline, nine-collection Firestore schema, and a deliberate architectural decision to avoid a vector database. Very few undergraduates have shipped retrieval-augmented generation inside a company.

Around that sit two self-directed full-stack products and a portfolio whose WebGL and motion system he wrote by hand — so the claim is: he has done this both under supervision and alone.

## Operating Context

- **Evaluated on a phone.** A significant share of first views happen on a mid-range Android device on mobile data, not on a desktop with a GPU.
- **GitHub is part of the surface.** Repository READMEs, commit recency and pinned repos are read as an extension of the portfolio and are evaluated alongside it.
- **The CV is the parallel document.** `public/Shravan-Dige-CV.pdf` is linked from the site; the two must never disagree on a fact.
- **Shared as a link.** The site is pasted into chat and email, so link previews and the page title are part of first impression.
- **Deadline-bound.** Work is paced against the start of an internship.

## Capabilities and Constraints

- Live at **shravandige.dev**, deployed on Vercel from `digheshravan/shravan-portfolio`, which is **a public repository** — the source is part of what a visitor can inspect.
- Single-page React application; no backend, no database, no authentication. Content is static and edited in `src/data/content.js`.
- The scroll, WebGL and motion architecture are hand-written and documented in `docs/adr/` (nine ADRs). Those decisions are load-bearing and should be read before changing motion or layering.
- The implementation currently honours `prefers-reduced-motion` with a full calm path and a `?motion=full` override. This is existing behaviour, not a product requirement the owner has stated.
- **Undecided:** which repositories count as flagship case studies versus archive entries.
- **Responsible-disclosure constraint.** The Tyrannix internship report lists, under Future Scope, that the Gemini API key still needs migrating to a server-side proxy. Writing that on a public page would publish an unresolved weakness in a live product belonging to a former employer. It must not appear on the site in any form, however it is phrased, unless Tyrannix confirms it is resolved or agrees to its disclosure. The *general* engineering lesson — that client-held API keys belong behind a proxy — may be discussed without reference to this product.

## Brand Commitments

- Name: **Shravan Dige**. Domain: **shravandige.dev**.
- Canonical external profiles: `github.com/digheshravan`, `linkedin.com/in/shravan-dige-655506234`.
- No aesthetic direction was captured during init by design. An incumbent visual system exists in the codebase and is design authority until deliberately replaced; it belongs in DESIGN.md, not here.

## Evidence on Hand

**Real and verifiable:**

- `Pet-Care-AI` — Flutter, Firebase, Google Gemini. Conversational assistant for pet owners.
- `Car_Rental_System` — Angular, Spring Boot, MySQL, JWT. Admin/Customer role separation.
- `doctor-apppointment-application` — Flutter, Supabase. Doctor/Patient roles, real-time slots, row-level security. *(Repository name contains a typo in the URL.)*
- `attendance_calculator_flutter`, `DocMind`, `Sigma-Web-Development-Course`, `digheshravan.github.io` — further public repositories.
- Education: MBA Tech Computer Engineering, MPSTME NMIMS Mumbai, 2024–2028. Diploma in Computer Engineering, Pravin Patil College, MSBTE, 2021–2024. SSC, MSBSHSE, 2020–2021.
- Smart India Hackathon 2025 — selected at college level, Round 1, 27 September 2025.
- UI/UX Design Certification, six-week programme, 2022.
- `public/Shravan-Dige-CV.pdf` — the CV as published.

**Professional experience — verified against `N130 Shravan Dige Final Report TIP.pdf`:**

- **Tyrannix Pvt. Ltd., Mumbai — Flutter Developer, Technical Internship Program.**
  18 May 2026 → 11 July 2026 (8 weeks). Industry mentor: Shivam Sharma, Director. Submitted for Semester VII, MBA Tech Computer Engineering, NMIMS. Tyrannix is a startup studio founded 2020, now building its own products under the brand *Plasma Deck*.
- **Project: PetPal AI** — "AI-Powered Pet Care Knowledge Portal and Intelligent Assistant for Pet Parents". This is the same work as the public `Pet-Care-AI` repository. **It is professional work done for a company, not a personal side project**, and the site currently mis-describes it as the latter.
- Technical substance, all from the report:
  - Flutter with clean layered architecture (data / domain / presentation), **Riverpod** state management, **GoRouter** routing.
  - Firebase Authentication, Cloud Firestore, Storage. Email/password auth with auth-aware navigation.
  - **Google Gemini 2.5 Flash** powering the "PawPal" assistant, multi-turn with pet-context injection.
  - **Retrieval-Augmented Generation pipeline** — keyword retrieval over Firestore using `arrayContainsAny`, ranked by relevance and species match, retrieved content injected into prompts and **cited in responses**. A vector database was deliberately avoided.
  - **Nine Firestore collections**: users, pets, health_records, chat_sessions, articles, categories, places, bookmarks, article_feedback. Per-domain repository classes keep data access out of the presentation layer.
  - **50+ knowledge-base articles** authored and seeded, with category taxonomy and auto-generated search keywords.
  - Health tracking with timeline and weight-chart views, plus scheduled local notifications for vaccine and medication reminders.
  - GPS-based local service directory with filtering and distance sorting.
  - Custom Material 3 dark-theme design system.
  - Week 2 of the internship was spent enhancing an existing Doctor Appointment Application — the same problem domain as his own `doctor-apppointment-application` repository.

**Upcoming:** a six-month internship next summer, expected to be primarily management rather than technical. Not yet a claim that can be made on the site.

**Disclosure boundaries — decided by the owner:**

- **No mentor or individual names** appear anywhere on the site. Decided.
- **Tyrannix is described in one short line covering what they do** — a Mumbai startup studio that builds and ships its own digital products. Decided. Their internal business strategy (the Plasma Deck pivot, the "plant many seeds" methodology, revenue and funding philosophy) is theirs and is **not republished**.
- The report's Future Scope names an unresolved security issue in the delivered product. **It must not be described publicly** while the product is live — see Capabilities and Constraints.
- The report PDF is gitignored and is source material only; it is never a published asset.

**Known absences future work must not fabricate:**

- No security tooling, research, publications, or a project named CodeSentinel. No employment history beyond the internship above. No testimonials, metrics, user numbers, or awards other than the SIH college-level selection recorded above.

## Product Principles

1. **Every claim survives a click.** Owner-stated, non-negotiable. Nothing appears on the site that a visitor cannot verify in the public repositories or the CV. Where a credential is real but undocumented, the gap is left visible rather than filled.
2. **Fast on a mid-range phone.** Owner-stated, non-negotiable. The device a visitor actually evaluates on sets the performance budget, and visual ambition yields to it rather than the reverse.
3. **Complete, not curated to nothing.** The owner wants everything he has built shown. Breadth is a feature; depth is applied to the strongest work rather than used as a reason to hide the rest.
4. **India first, internationally legible.** Domestic hiring context is the near-term reality; nothing should read as parochial to an overseas reader or as rootless to a local one.
5. **The site is itself an exhibit.** The repository is public and the interface is hand-built, so implementation quality is part of the work on display, not merely its container.
