export default function TerminalWindow({
  title = 'ethan@portfolio: ~',
  children,
  className = ''
}) {
  return (
    <div className={`min-h-screen flex flex-col scanline ${className}`}>
      {/* Title bar */}
      <div
        className="sticky top-0 z-40 flex items-center px-4 py-2 border-b"
        style={{
          background: 'var(--terminal-chrome)',
          borderColor: 'var(--terminal-border)'
        }}
      >
        {/* Window dots */}
        <div className="flex items-center gap-2 mr-4">
          <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F56' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#27C93F' }} />
        </div>

        {/* Title */}
        <div
          className="flex-1 text-center text-xs opacity-60"
          style={{ color: 'var(--terminal-fg)' }}
        >
          {title}
        </div>

        {/* Spacer to balance the dots */}
        <div className="w-14" />
      </div>

      {/* Terminal body */}
      <div
        className="flex-1 px-4 md:px-8 py-6"
        style={{ background: 'var(--terminal-bg)' }}
      >
        {children}
      </div>
    </div>
  );
}
