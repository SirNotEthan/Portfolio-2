import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';
import { posts } from '../../data/blog';

export default function BlogSection() {
  return (
    <section className="py-16">
      <CommandLine command="ls blog/ --recent" />
      <TerminalOutput delay={400}>
        <div className="space-y-3 max-w-3xl">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-sm"
              style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{post.title}</span>
                <span className="text-xs shrink-0" style={{ color: 'var(--terminal-comment)' }}>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--terminal-fg)' }}>{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-sm"
                    style={{
                      background: 'rgba(0, 229, 255, 0.08)',
                      color: 'var(--terminal-cyan)',
                      border: '1px solid rgba(0, 229, 255, 0.2)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="text-xs" style={{ color: 'var(--terminal-comment)' }}>
            // more posts coming soon
          </div>
        </div>
      </TerminalOutput>
    </section>
  );
}
