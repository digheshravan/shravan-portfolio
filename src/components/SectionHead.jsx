import { Reveal } from './Reveal'

/** Consistent section masthead: index, kicker, headline, optional note. */
export function SectionHead({ index, label, title, note, align = 'left' }) {
  return (
    <header className={`sectionHead sectionHead--${align}`} data-parallax="0.045">
      <div className="sectionHead__meta mono">
        <span className="sectionHead__index">{index}</span>
        <span className="sectionHead__rule" />
        <span className="sectionHead__label">{label}</span>
      </div>

      <h2 className="sectionHead__title">
        <Reveal mode="word" stagger={0.05}>
          {title}
        </Reveal>
      </h2>

      {note && <p className="sectionHead__note">{note}</p>}
    </header>
  )
}
