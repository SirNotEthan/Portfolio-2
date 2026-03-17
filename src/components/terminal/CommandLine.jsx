export default function CommandLine({
  command,
  className = ''
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <span style={{ color: 'var(--terminal-amber)' }}>ethan</span>
      <span style={{ color: 'var(--terminal-fg)' }}>@</span>
      <span style={{ color: 'var(--terminal-amber)' }}>portfolio</span>
      <span style={{ color: 'var(--terminal-cyan)' }}>:~</span>
      <span style={{ color: 'var(--terminal-fg)' }}>$ </span>
      <span style={{ color: 'var(--terminal-fg)' }}>{command}</span>
    </div>
  );
}
