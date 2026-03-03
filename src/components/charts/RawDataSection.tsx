import type { ReactElement } from 'react';

type RawDataCard = Readonly<{
  title: string;
  subtitle: string;
  format: string;
  size: string;
  url: string;
}>;

type Props = Readonly<{
  cards: ReadonlyArray<RawDataCard>;
}>;

const styles = {
  section: {
    marginTop: '3rem',
    borderTop: '1px solid #ddd',
    paddingTop: '2rem',
  },
  heading: {
    margin: '0 0 1rem',
    fontSize: '1rem',
    fontWeight: 600,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  card: {
    flex: '1 1 calc(50% - 8px)',
    minWidth: '280px',
    border: '1px solid #ddd',
    padding: '16px',
  },
  cardTitle: {
    margin: '0 0 6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#232323',
  },
  cardSubtitle: {
    margin: '0 0 12px',
    fontSize: '13px',
    color: '#898989',
    lineHeight: 1.5,
  },
  cardMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '12px',
    color: '#898989',
  },
  link: {
    fontSize: '13px',
    color: '#232323',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
} as const;

export const RawDataSection = (props: Props): ReactElement => {
  const { cards } = props;

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Raw Data</h2>
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} style={styles.card}>
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <p style={styles.cardSubtitle}>{card.subtitle}</p>
            <div style={styles.cardMeta}>
              <span>{card.format}</span>
              <span>{card.size}</span>
              <a href={card.url} style={styles.link} download>
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
