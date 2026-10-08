import { useMemo, useState } from 'react';
import { projects, type Project, type ProjectKind } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { LissajousFigure } from '../components/figures';
import { cx } from '../lib/cx';
import styles from './Work.module.css';

const KIND_LABEL: Record<ProjectKind, string> = {
  research: 'Research',
  project: 'Project',
  coursework: 'Imperial',
};

const ALL = 'All';

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primary = project.links[0];
  return (
    <article id={`project-${project.id}`} className={styles.row}>
      <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
      <div className={styles.main}>
        <h3 className={styles.title}>
          {primary ? (
            <a href={primary.href} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        {project.note ? <p className={styles.note}>{project.note}</p> : null}
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.footer}>
          <p className={styles.tags}>{project.tags.join(' · ')}</p>
          {project.links.length > 0 ? (
            <ul className={styles.links}>
              {project.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className={styles.meta}>
        <span>{project.year}</span>
        <span>{KIND_LABEL[project.kind]}</span>
      </div>
    </article>
  );
}

export function Work() {
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
    });
    // Only offer filters that match more than one project.
    return [ALL, ...[...counts].filter(([, n]) => n > 1).map(([t]) => t)];
  }, []);
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <Section
      id="work"
      index="01"
      label="Work"
      figure={<LissajousFigure n={2} />}
      title="Selected work"
      kicker="Research, things built for Palantir’s developer community, and systems projects from Imperial."
    >
      <Reveal>
        <div className={styles.filters} role="group" aria-label="Filter work by tag">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={cx(styles.filter, filter === t && styles.filterActive)}
              aria-pressed={filter === t}
              onClick={() => {
                setFilter(t);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>

      <div className={styles.list} aria-live="polite">
        {visible.map((p, i) => (
          <Reveal key={p.id} delay={i * 50}>
            <ProjectRow project={p} index={i} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <a
          className={styles.more}
          href="https://github.com/jayambadkar"
          target="_blank"
          rel="noopener noreferrer"
        >
          More on GitHub
          <Icon name="arrow-up-right" size={14} />
        </a>
      </Reveal>
    </Section>
  );
}
