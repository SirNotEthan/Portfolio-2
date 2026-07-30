import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';
import { nowStatus, usesCategories } from '../../data/uses';

export default function UsesSection() {
  return (
    <section className="py-16">
      <CommandLine command="cat now.md" />
      <TerminalOutput delay={400}>
        <div
          className="max-w-3xl p-4 rounded-sm mb-6"
          style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}
        >
          <div className="text-xs mb-2" style={{ color: 'var(--terminal-comment)' }}>
            // updated {new Date(nowStatus.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          <ul className="space-y-1">
            {nowStatus.focus.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--terminal-fg)' }}>
                <span style={{ color: 'var(--terminal-amber)' }}>-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </TerminalOutput>

      <CommandLine command="cat uses.md" />
      <TerminalOutput delay={400}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {usesCategories.map((cat) => (
            <div
              key={cat.name}
              className="p-4 rounded-sm"
              style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}
            >
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--terminal-cyan)' }}>
                ## {cat.name}
              </div>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm" style={{ color: 'var(--terminal-fg)' }}>
                    <span style={{ color: 'var(--terminal-amber)' }}>-</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </TerminalOutput>
    </section>
  );
}
