import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';

export default function AboutSection({ githubStats }) {
  const recentActivity = githubStats?.recentActivity;
  const activityRate = recentActivity?.totalRepos > 0
    ? Math.round((recentActivity.activeRepos / recentActivity.totalRepos) * 100)
    : 0;

  return (
    <section className="py-16">
      <CommandLine command="cat about.md" />
      <TerminalOutput delay={600}>
        <div className="max-w-3xl space-y-6 text-sm">
          {/* Markdown-style header */}
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--terminal-cyan)' }}>
              # About Me
            </h2>
            <p style={{ color: 'var(--terminal-fg)' }}>
              Passionate developer from the UK, dedicated to creating exceptional
              digital experiences across web development, game development, and 3D
              modeling. I love turning complex problems into clean, elegant solutions.
            </p>
          </div>

          {/* Values */}
          <div>
            <h3 className="font-bold mb-2" style={{ color: 'var(--terminal-cyan)' }}>
              ## Values
            </h3>
            <div className="space-y-1 pl-2">
              <div>
                <span style={{ color: 'var(--terminal-amber)' }}>-</span>{' '}
                <span className="font-bold" style={{ color: '#FFFFFF' }}>Clean Code</span>{' '}
                <span style={{ color: 'var(--terminal-comment)' }}>
                  — Writing maintainable, scalable, and efficient code
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--terminal-amber)' }}>-</span>{' '}
                <span className="font-bold" style={{ color: '#FFFFFF' }}>Performance</span>{' '}
                <span style={{ color: 'var(--terminal-comment)' }}>
                  — Optimizing for speed and user experience
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--terminal-amber)' }}>-</span>{' '}
                <span className="font-bold" style={{ color: '#FFFFFF' }}>Innovation</span>{' '}
                <span style={{ color: 'var(--terminal-comment)' }}>
                  — Exploring new technologies and creative solutions
                </span>
              </div>
            </div>
          </div>

          {/* Git status style stats */}
          {githubStats && (
            <div
              className="p-4 rounded-sm"
              style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}
            >
              <h3 className="font-bold mb-3" style={{ color: 'var(--terminal-cyan)' }}>
                $ git status
              </h3>
              <div className="space-y-1">
                <div>
                  <span style={{ color: 'var(--terminal-comment)' }}>On branch: </span>
                  <span style={{ color: 'var(--terminal-green)' }}>main</span>
                </div>
                <div style={{ color: 'var(--terminal-comment)' }}>
                  Your branch is up to date with 'origin/main'.
                </div>
                <div className="pt-2">
                  <span style={{ color: 'var(--terminal-comment)' }}>Changes in the last 90 days:</span>
                </div>
                <div className="pl-4 space-y-1">
                  <div>
                    <span style={{ color: 'var(--terminal-green)' }}>  modified: </span>
                    <span style={{ color: 'var(--terminal-fg)' }}>{recentActivity?.recentlyUpdated || 0} repositories</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--terminal-green)' }}>  active:   </span>
                    <span style={{ color: 'var(--terminal-fg)' }}>{recentActivity?.activeRepos || 0} repositories</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--terminal-cyan)' }}>  rate:     </span>
                    <span style={{ color: 'var(--terminal-fg)' }}>{activityRate}% activity</span>
                  </div>
                </div>
              </div>

              {/* Stats table */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--terminal-border)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <StatBlock label="Repos" value={githubStats.publicRepos} color="var(--terminal-amber)" />
                  <StatBlock label="Stars" value={githubStats.totalStars} color="var(--terminal-yellow)" />
                  <StatBlock label="Forks" value={githubStats.totalForks} color="var(--terminal-green)" />
                  <StatBlock label="Followers" value={githubStats.followers} color="var(--terminal-purple)" />
                </div>
              </div>
            </div>
          )}

          {/* Languages export */}
          {githubStats?.languages && (
            <div>
              <span style={{ color: 'var(--terminal-purple)' }}>export </span>
              <span style={{ color: 'var(--terminal-fg)' }}>LANGUAGES</span>
              <span style={{ color: 'var(--terminal-comment)' }}>=</span>
              <span style={{ color: 'var(--terminal-yellow)' }}>
                "{githubStats.languages.slice(0, 10).join(', ')}"
              </span>
            </div>
          )}
        </div>
      </TerminalOutput>
    </section>
  );
}

function StatBlock({ label, value, color }) {
  return (
    <div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--terminal-comment)' }}>{label}</div>
    </div>
  );
}
