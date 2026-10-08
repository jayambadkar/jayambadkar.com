import { useMemo, useState } from 'react';
import { projects, type Project, type ProjectStatus } from '../data';
import { PlaceholderBadge } from '../components/Badge';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { cx } from '../lib/cx';
import styles from './Projects.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  archived: 'Archived',
};

const ALL = 'All';

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const link = project.href ?? project.repo;
  return (
    <article className={cx(styles.row, link && styles.linked)}>
      <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
      <div className={styles.main}>
        <h3 className={styles.title}>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
              {project.title}
            </a>
          ) : (
            project.title
          )}
          {project.placeholder ? <PlaceholderBadge /> : null}
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <p className={styles.tags}>{project.tags.join(' · ')}</p>
      </div>
      <div className={styles.meta}>
        <span>{project.year ?? STATUS_LABEL[project.status]}</span>
        {link ? <Icon name="arrow-up-right" size={16} className={styles.arrow} /> : null}
      </div>
    </article>
  );
}

export function Projects() {
  const tags = useMemo(() => [ALL, ...new Set(projects.flatMap((p) => p.tags))], []);
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <Section id="projects" index="02" label="Projects" title="Selected work">
      <Reveal>
        <div className={styles.filters} role="group" aria-label="Filter projects by tag">
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
          <Reveal key={p.id} delay={i * 60}>
            <ProjectRow project={p} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
