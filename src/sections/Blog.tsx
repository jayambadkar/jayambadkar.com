import { BLOG_URL, posts } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { FordCirclesFigure } from '../components/figures';
import styles from './Blog.module.css';

const LIMIT = 6;

const dateFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

export function Blog() {
  const recent = posts.slice(0, LIMIT);
  return (
    <Section
      id="blog"
      index="03"
      label="Blog"
      title="Blog"
      kicker="Notes on maths, university and life."
      figure={<FordCirclesFigure n={4} />}
    >
      <ol className={styles.list}>
        {recent.map((p, i) => (
          <Reveal as="li" key={p.url} delay={i * 50}>
            <a className={styles.post} href={p.url} target="_blank" rel="noopener noreferrer">
              <time className={styles.date} dateTime={p.date}>
                {formatDate(p.date)}
              </time>
              <span className={styles.body}>
                <span className={styles.title}>{p.title}</span>
                {p.excerpt ? <span className={styles.excerpt}>{p.excerpt}</span> : null}
              </span>
              <span className={styles.cats}>{p.categories.join(' · ')}</span>
              <Icon name="arrow-up-right" size={16} className={styles.arrow} />
            </a>
          </Reveal>
        ))}
      </ol>
      <Reveal>
        <a className={styles.more} href={BLOG_URL} target="_blank" rel="noopener noreferrer">
          Read the full blog at jayambadkar.github.io
          <Icon name="arrow-up-right" size={14} />
        </a>
      </Reveal>
    </Section>
  );
}
