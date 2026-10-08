import { useMemo, useState } from 'react';
import { projects, type Project, type ProjectStatus } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { cx } from '../lib/cx';
import shared from './section.module.css';
import styles from './Projects.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  archived: 'Archived',
};

const ALL = 'All';

function ProjectCard({ project }: { project: Project }) {
  const link = project.href ?? project.repo;
  return (
    <article
      className={cx(shared.card, styles.card, project.featured && styles.featured)}
      onPointerMove={(e) => {
        // Spotlight effect follows the cursor via CSS custom properties.
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }}
    >
      <div className={styles.cardTop}>
        <span className={styles.status} data-status={project.status}>
          {STATUS_LABEL[project.status]}
        </span>
        {project.placeholder ? <span className={shared.placeholderBadge}>placeholder</span> : null}
        {project.year ? <span className={styles.year}>{project.year}</span> : null}
      </div>
      <h3 className={styles.title}>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
            {project.title}
            <Icon name="arrow-up-right" size={16} />
          </a>
        ) : (
          project.title
        )}
      </h3>
      <p className={styles.summary}>{project.summary}</p>
      <ul className={styles.tags} aria-label="Technologies">
        {project.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </article>
  );
}

export function Projects() {
  const tags = useMemo(() => [ALL, ...new Set(projects.flatMap((p) => p.tags))], []);
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <section
      id="projects"
      className={shared.section}
      aria-labelledby="projects-title"
      tabIndex={-1}
    >
      <div className="container">
        <SectionHeading
          id="projects-title"
          index="02 / projects"
          title="Things I've built."
          kicker="A selection of projects. More coming soon, this list is still being filled in."
        />

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

        <div className={styles.grid} aria-live="polite">
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={i * 70} className={styles.cell}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
