import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import TerminalWindow from '../components/terminal/TerminalWindow';
import CommandLine from '../components/terminal/CommandLine';
import TerminalOutput from '../components/terminal/TerminalOutput';
import { projects } from '../data/projects';
import { caseStudies } from '../data/caseStudies';

export default function CaseStudyPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const study = caseStudies[slug];

  if (!project || !study) {
    return (
      <TerminalWindow title="ethan@portfolio: ~/work/not-found">
        <div className="text-sm space-y-4">
          <CommandLine command={`cat work/${slug}.md`} />
          <div style={{ color: 'var(--terminal-red)' }}>cat: work/{slug}.md: No such file or directory</div>
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80" style={{ color: 'var(--terminal-cyan)' }}>
            <FaArrowLeft /> back to portfolio
          </Link>
        </div>
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow title={`ethan@portfolio: ~/work/${slug}`}>
      <div className="max-w-3xl mx-auto text-sm space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80" style={{ color: 'var(--terminal-cyan)' }}>
          <FaArrowLeft /> back to portfolio
        </Link>

        <div>
          <CommandLine command={`cat work/${slug}.md`} />
          <TerminalOutput delay={200}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>{project.name}</h1>
            <p style={{ color: 'var(--terminal-comment)' }}>{project.description}</p>
          </TerminalOutput>
        </div>

        {project.images?.[0] && (
          <img
            src={project.images[0]}
            alt={`${project.name} architecture`}
            className="w-full rounded-sm"
            style={{ border: '1px solid var(--terminal-border)' }}
          />
        )}

        <Section heading="## Problem">
          <p style={{ color: 'var(--terminal-fg)' }}>{study.problem}</p>
        </Section>

        <Section heading="## Approach">
          <ul className="space-y-2 pl-2">
            {study.approach.map((step, i) => (
              <li key={i} className="flex items-start gap-2" style={{ color: 'var(--terminal-fg)' }}>
                <span style={{ color: 'var(--terminal-amber)' }}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </Section>

        <Section heading="## Stack">
          <div className="flex flex-wrap gap-2">
            {study.stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded-sm"
                style={{
                  background: 'rgba(255, 176, 0, 0.1)',
                  color: 'var(--terminal-amber)',
                  border: '1px solid rgba(255, 176, 0, 0.2)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </Section>

        <Section heading="## Outcome">
          <p style={{ color: 'var(--terminal-fg)' }}>{study.outcome}</p>
        </Section>

        <div className="flex gap-6 pt-2" style={{ borderTop: '1px solid var(--terminal-border)' }}>
          {study.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 pt-4 hover:opacity-80 transition-opacity"
              style={{ color: link.label === 'Source' ? 'var(--terminal-fg)' : 'var(--terminal-cyan)' }}
            >
              {link.label === 'Source' ? <FaGithub /> : <FaExternalLinkAlt />}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </TerminalWindow>
  );
}

function Section({ heading, children }) {
  return (
    <div>
      <h2 className="font-bold mb-2" style={{ color: 'var(--terminal-cyan)' }}>{heading}</h2>
      {children}
    </div>
  );
}
