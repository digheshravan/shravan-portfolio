import { Reveal } from './Reveal'

/**
 * Consistent section masthead: index, headline, optional note.
 *
 * No kicker label above the title — a label restating what the heading
 * already says doesn't earn its line. The index stays: it's a numbered
 * readout, not decoration, and the site's own section rail depends on the
 * same ordering.
 */
export function SectionHead({ index, title, note, align = 'left' }) {
  return (
    <header className={`sectionHead sectionHead--${align}`} data-parallax="0.045">
      <div className="sectionHead__meta mono">
        <span className="sectionHead__index">{index}</span>
        <span className="sectionHead__rule" />
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
