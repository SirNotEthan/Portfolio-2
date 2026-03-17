import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MotionDiv = motion.div;
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';

const CATEGORIES = ['All', 'Web Development', 'Game Development', '3D Modeling'];

const FLAGS = {
  'All': '--all',
  'Web Development': '--web',
  'Game Development': '--games',
  '3D Modeling': '--3d'
};

export default function ProjectsSection({
  projects,
  featuredProjects,
  projectsLoading,
  projectStats
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedProject, setExpandedProject] = useState(null);

  const filtered = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section className="py-16">
      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-16">
          <CommandLine command="git log --oneline --featured" />
          <TerminalOutput delay={600}>
            <div className="space-y-6 max-w-4xl">
              {featuredProjects.map((project) => (
                <FeaturedCard key={project.id} project={project} />
              ))}
            </div>
          </TerminalOutput>
        </div>
      )}

      {/* All projects */}
      <CommandLine command={`ls projects/ ${FLAGS[selectedCategory] || '--all'}`} />
      <TerminalOutput delay={400}>
        {/* Flags / filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1 rounded-sm text-xs transition-colors cursor-pointer"
              style={{
                background: selectedCategory === cat ? 'var(--terminal-amber)' : 'var(--terminal-surface)',
                color: selectedCategory === cat ? '#000' : 'var(--terminal-fg)',
                border: `1px solid ${selectedCategory === cat ? 'var(--terminal-amber)' : 'var(--terminal-border)'}`,
                fontWeight: selectedCategory === cat ? 600 : 400
              }}
            >
              {FLAGS[cat]}{' '}
              <span style={{ opacity: 0.7 }}>
                ({cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {projectsLoading && (
          <div className="py-4" style={{ color: 'var(--terminal-amber)' }}>
            Loading projects from GitHub...
          </div>
        )}

        {/* Project table */}
        <div className="overflow-x-auto">
          {/* Header */}
          <div
            className="grid text-xs font-bold py-2 min-w-[500px]"
            style={{
              gridTemplateColumns: '2fr 1fr 1fr 80px',
              color: 'var(--terminal-comment)',
              borderBottom: '1px solid var(--terminal-border)'
            }}
          >
            <span>NAME</span>
            <span>STATUS</span>
            <span>LANG</span>
            <span className="text-right">STARS</span>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <MotionDiv
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((project) => (
                <div key={project.id}>
                  <button
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                    className="grid w-full text-left text-sm py-2 min-w-[500px] hover:bg-white/5 transition-colors cursor-pointer"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr 80px',
                      borderBottom: '1px solid var(--terminal-border)'
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {project.featured && <FaStar className="text-xs" style={{ color: 'var(--terminal-amber)' }} />}
                      <span style={{ color: 'var(--terminal-fg)' }}>{project.name}</span>
                    </span>
                    <span style={{
                      color: project.status === 'Completed'
                        ? 'var(--terminal-green)'
                        : project.status === 'In Progress'
                          ? 'var(--terminal-amber)'
                          : 'var(--terminal-comment)'
                    }}>
                      {project.status}
                    </span>
                    <span style={{ color: 'var(--terminal-purple)' }}>{project.language || '—'}</span>
                    <span className="text-right" style={{ color: 'var(--terminal-yellow)' }}>
                      {project.stars || 0}
                    </span>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {expandedProject === project.id && (
                      <MotionDiv
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ExpandedDetail project={project} />
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </MotionDiv>
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="mt-4 text-xs" style={{ color: 'var(--terminal-comment)' }}>
          {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
          {projectStats?.totalStars > 0 && ` | ${projectStats.totalStars} total stars`}
          {projectStats?.languages?.length > 0 && ` | ${projectStats.languages.length} languages`}
        </div>
      </TerminalOutput>
    </section>
  );
}

function FeaturedCard({ project }) {
  const hash = Math.random().toString(16).slice(2, 9);
  const date = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      })
    : 'Recently';

  return (
    <div
      className="p-4 rounded-sm"
      style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}
    >
      <div className="mb-3 text-sm">
        <span style={{ color: 'var(--terminal-amber)' }}>commit </span>
        <span style={{ color: 'var(--terminal-fg)' }}>{hash}</span>
        <span style={{ color: 'var(--terminal-comment)' }}> (HEAD -&gt; main, tag: </span>
        <span style={{ color: 'var(--terminal-yellow)' }}>featured</span>
        <span style={{ color: 'var(--terminal-comment)' }}>)</span>
      </div>

      <div className="text-sm space-y-1 mb-3">
        <div>
          <span style={{ color: 'var(--terminal-comment)' }}>Author: </span>
          <span style={{ color: 'var(--terminal-fg)' }}>Ethan &lt;ethan@sirnotethan.com&gt;</span>
        </div>
        <div>
          <span style={{ color: 'var(--terminal-comment)' }}>Date:   </span>
          <span style={{ color: 'var(--terminal-fg)' }}>{date}</span>
        </div>
      </div>

      <div className="pl-4 space-y-2 text-sm">
        <div className="text-base font-bold" style={{ color: '#FFFFFF' }}>
          {project.name}
        </div>
        <div style={{ color: 'var(--terminal-fg)' }}>{project.description}</div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
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

        {/* Stats */}
        <div className="flex gap-4 text-xs" style={{ color: 'var(--terminal-comment)' }}>
          <span>Status: <span style={{ color: project.status === 'Completed' ? 'var(--terminal-green)' : 'var(--terminal-amber)' }}>{project.status}</span></span>
          {project.stars > 0 && <span>Stars: <span style={{ color: 'var(--terminal-yellow)' }}>{project.stars}</span></span>}
          {project.forks > 0 && <span>Forks: <span style={{ color: 'var(--terminal-green)' }}>{project.forks}</span></span>}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-1">
          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
              style={{ color: 'var(--terminal-cyan)' }}
            >
              <FaExternalLinkAlt />
              {project.category === 'Game Development' ? 'Play' : project.category === '3D Modeling' ? 'View' : 'Demo'}
            </a>
          )}
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
            style={{ color: 'var(--terminal-fg)' }}
          >
            <FaGithub /> Source
          </a>
        </div>
      </div>
    </div>
  );
}

function ExpandedDetail({ project }) {
  return (
    <div
      className="p-4 text-sm mb-1"
      style={{
        background: 'var(--terminal-surface)',
        borderLeft: '2px solid var(--terminal-amber)'
      }}
    >
      <div className="space-y-2">
        <div style={{ color: 'var(--terminal-fg)' }}>{project.description}</div>

        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
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
        )}

        <div className="flex gap-4 pt-1">
          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
              style={{ color: 'var(--terminal-cyan)' }}
            >
              <FaExternalLinkAlt />
              {project.category === 'Game Development' ? 'Play' : 'Demo'}
            </a>
          )}
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
            style={{ color: 'var(--terminal-fg)' }}
          >
            <FaGithub /> Source
          </a>
        </div>
      </div>
    </div>
  );
}
