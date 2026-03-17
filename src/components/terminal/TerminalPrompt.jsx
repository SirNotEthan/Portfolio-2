import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiX } from 'react-icons/hi';

const MotionDiv = motion.div;

export default function TerminalPrompt({ commands }) {
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [feedback, setFeedback] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed === 'help') {
      setFeedback({ type: 'help', commands });
      setTimeout(() => setFeedback(null), 5000);
    } else if (trimmed === 'clear') {
      setFeedback(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (commands[trimmed]) {
      commands[trimmed].action();
      setFeedback(null);
    } else {
      // Check aliases
      const match = Object.entries(commands).find(([, cmd]) =>
        cmd.aliases?.some(a => a.toLowerCase() === trimmed)
      );
      if (match) {
        match[1].action();
        setFeedback(null);
      } else {
        setFeedback({ type: 'error', message: trimmed });
        setTimeout(() => setFeedback(null), 3000);
      }
    }

    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const allCommands = ['help', 'clear', ...Object.keys(commands)];
      // Also include aliases
      Object.entries(commands).forEach(([, cmd]) => {
        if (cmd.aliases) allCommands.push(...cmd.aliases);
      });
      const matches = allCommands.filter(c => c.startsWith(inputValue.toLowerCase()));
      if (matches.length === 1) {
        setInputValue(matches[0]);
      } else if (matches.length > 1) {
        setFeedback({ type: 'suggest', options: matches });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  // Focus input on '/' key press (desktop shortcut)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Desktop prompt - fixed bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 hidden md:block border-t"
        style={{
          background: 'rgba(28, 33, 40, 0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--terminal-border)'
        }}
      >
        {/* Feedback area */}
        <AnimatePresence>
          {feedback && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-2 text-sm border-b" style={{ borderColor: 'var(--terminal-border)' }}>
                {feedback.type === 'error' && (
                  <span style={{ color: 'var(--terminal-red)' }}>
                    command not found: {feedback.message}. Type <span style={{ color: 'var(--terminal-amber)' }}>help</span> for available commands.
                  </span>
                )}
                {feedback.type === 'suggest' && (
                  <span style={{ color: 'var(--terminal-comment)' }}>
                    {feedback.options.join('  ')}
                  </span>
                )}
                {feedback.type === 'help' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1">
                    {Object.entries(feedback.commands).map(([name, cmd]) => (
                      <div key={name}>
                        <span style={{ color: 'var(--terminal-amber)' }}>{name}</span>
                        <span style={{ color: 'var(--terminal-comment)' }}> - {cmd.description}</span>
                      </div>
                    ))}
                    <div>
                      <span style={{ color: 'var(--terminal-amber)' }}>help</span>
                      <span style={{ color: 'var(--terminal-comment)' }}> - Show this help</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--terminal-amber)' }}>clear</span>
                      <span style={{ color: 'var(--terminal-comment)' }}> - Scroll to top</span>
                    </div>
                  </div>
                )}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3">
          <span style={{ color: 'var(--terminal-amber)' }}>ethan</span>
          <span style={{ color: 'var(--terminal-fg)' }}>@</span>
          <span style={{ color: 'var(--terminal-amber)' }}>portfolio</span>
          <span style={{ color: 'var(--terminal-cyan)' }}>:~</span>
          <span style={{ color: 'var(--terminal-fg)' }}>$ </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none ml-1"
            style={{ color: 'var(--terminal-fg)', caretColor: 'var(--terminal-amber)' }}
            placeholder="type a command... (press / to focus)"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>

      {/* Mobile floating button + menu */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {showMobileMenu && (
            <MotionDiv
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-14 right-0 w-52 rounded-lg overflow-hidden border mb-2"
              style={{
                background: 'var(--terminal-chrome)',
                borderColor: 'var(--terminal-border)'
              }}
            >
              {Object.entries(commands).map(([name, cmd]) => (
                <button
                  key={name}
                  onClick={() => {
                    cmd.action();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
                  style={{ color: 'var(--terminal-fg)' }}
                >
                  <span style={{ color: 'var(--terminal-amber)' }}>$</span> {name}
                </button>
              ))}
            </MotionDiv>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="w-12 h-12 rounded-full flex items-center justify-center border text-lg transition-colors"
          style={{
            background: 'var(--terminal-chrome)',
            borderColor: 'var(--terminal-border)',
            color: 'var(--terminal-amber)'
          }}
        >
          {showMobileMenu ? <HiX /> : <span>$_</span>}
        </button>
      </div>

      {/* Bottom padding to prevent content from being hidden behind the prompt */}
      <div className="hidden md:block h-14" />
    </>
  );
}
