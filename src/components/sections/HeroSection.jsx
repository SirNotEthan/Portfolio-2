import { FaGithub, FaTwitter, FaDiscord, FaDownload } from 'react-icons/fa';
import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';

const ASCII_ART = `
 ███████╗████████╗██╗  ██╗ █████╗ ███╗   ██╗
 ██╔════╝╚══██╔══╝██║  ██║██╔══██╗████╗  ██║
 █████╗     ██║   ███████║███████║██╔██╗ ██║
 ██╔══╝     ██║   ██╔══██║██╔══██║██║╚██╗██║
 ███████╗   ██║   ██║  ██║██║  ██║██║ ╚████║
 ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝`.trimStart();

const PALETTE_COLORS = [
  '#FF5555', '#FFB000', '#F1FA8C', '#39FF14',
  '#00D4FF', '#BD93F9', '#FF79C6', '#C9D1D9'
];

export default function HeroSection({ githubStats, onNavigate }) {
  const startYear = 2022;
  const uptime = new Date().getFullYear() - startYear;

  return (
    <section className="min-h-screen flex flex-col justify-center py-12">
      <CommandLine command="neofetch" />
      <TerminalOutput delay={800}>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* ASCII art */}
          <pre
            className="text-xs md:text-sm leading-tight hidden md:block select-none overflow-x-auto"
            style={{ color: 'var(--terminal-amber)' }}
          >
            {ASCII_ART}
          </pre>

          {/* Neofetch info panel */}
          <div className="space-y-1 text-sm">
            <div>
              <span style={{ color: 'var(--terminal-amber)' }} className="font-bold terminal-glow">
                ethan
              </span>
              <span style={{ color: 'var(--terminal-fg)' }}>@</span>
              <span style={{ color: 'var(--terminal-amber)' }} className="font-bold terminal-glow">
                portfolio
              </span>
            </div>
            <div style={{ color: 'var(--terminal-border)' }}>─────────────────────</div>

            <InfoLine label="Title" value="Full-Stack Developer" />
            <InfoLine label="Location" value="United Kingdom" />
            <InfoLine label="Uptime" value={`${uptime}+ years coding`} />
            <InfoLine label="Repos" value={githubStats?.publicRepos ?? '...'} />
            <InfoLine label="Stars" value={githubStats?.totalStars ?? '...'} />
            <InfoLine label="Followers" value={githubStats?.followers ?? '...'} />
            <InfoLine
              label="Languages"
              value={
                githubStats?.languages?.slice(0, 5).join(', ') || 'JS, TS, Lua, Python'
              }
            />
            <InfoLine label="Shell" value="React 19 + Vite 6" />
            <InfoLine label="Terminal" value="Portfolio v3.0" />

            {/* Palette */}
            <div className="pt-2 flex gap-1">
              {PALETTE_COLORS.map((c) => (
                <div
                  key={c}
                  className="w-4 h-4 rounded-sm"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action commands */}
        <div className="mt-8 space-y-2 text-sm">
          <div style={{ color: 'var(--terminal-border)' }}>─────────────────────</div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="https://github.com/SirNotEthan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--terminal-fg)' }}
            >
              <FaGithub style={{ color: 'var(--terminal-amber)' }} />
              <span style={{ color: 'var(--terminal-comment)' }}>$</span> open github.com/SirNotEthan
            </a>

            <a
              href="https://x.com/SirNotEthan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--terminal-fg)' }}
            >
              <FaTwitter style={{ color: 'var(--terminal-amber)' }} />
              <span style={{ color: 'var(--terminal-comment)' }}>$</span> open x.com/SirNotEthan
            </a>

            <a
              href="https://discordapp.com/users/959555371385622590"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--terminal-fg)' }}
            >
              <FaDiscord style={{ color: 'var(--terminal-amber)' }} />
              <span style={{ color: 'var(--terminal-comment)' }}>$</span> open discord/SirNotEthan
            </a>
          </div>

          {/* Resume + navigation commands */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            <button
              onClick={() => alert('Add your resume PDF to /public/resume.pdf')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: 'var(--terminal-green)' }}
            >
              <FaDownload />
              <span style={{ color: 'var(--terminal-comment)' }}>$</span> download resume.pdf
            </button>

            <button
              onClick={() => onNavigate?.('projects')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: 'var(--terminal-cyan)' }}
            >
              <span style={{ color: 'var(--terminal-comment)' }}>$</span> cd projects/
            </button>

            <button
              onClick={() => onNavigate?.('contact')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: 'var(--terminal-cyan)' }}
            >
              <span style={{ color: 'var(--terminal-comment)' }}>$</span> mail ethan
            </button>
          </div>
        </div>
      </TerminalOutput>
    </section>
  );
}

function InfoLine({ label, value }) {
  return (
    <div>
      <span style={{ color: 'var(--terminal-amber)' }} className="font-bold">{label}</span>
      <span style={{ color: 'var(--terminal-comment)' }}>: </span>
      <span style={{ color: 'var(--terminal-fg)' }}>{value}</span>
    </div>
  );
}
