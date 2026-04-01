import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';
import { serviceTiers, addOns } from '../../data/pricing';

const MotionDiv = motion.div;

export default function ServicesSection() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="py-16">
      {/* Tier cards */}
      <CommandLine command="cat services/pricing.json" />
      <TerminalOutput delay={400}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {serviceTiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              expanded={expanded === tier.id}
              onToggle={() => setExpanded(expanded === tier.id ? null : tier.id)}
            />
          ))}
        </div>
      </TerminalOutput>

      {/* Add-ons */}
      <CommandLine command="cat services/add-ons.json" />
      <TerminalOutput delay={400}>
        <div
          className="mb-12 rounded-sm overflow-hidden"
          style={{ border: '1px solid var(--terminal-border)' }}
        >
          {/* Header */}
          <div
            className="grid text-xs font-bold px-4 py-2"
            style={{
              gridTemplateColumns: '1fr auto',
              background: 'var(--terminal-surface)',
              color: 'var(--terminal-comment)',
              borderBottom: '1px solid var(--terminal-border)',
            }}
          >
            <span>ADD-ON</span>
            <span>PRICE</span>
          </div>
          {addOns.map((addon, i) => (
            <div
              key={i}
              className="grid px-4 py-2 text-sm"
              style={{
                gridTemplateColumns: '1fr auto',
                borderBottom: i < addOns.length - 1 ? '1px solid var(--terminal-border)' : 'none',
              }}
            >
              <span style={{ color: 'var(--terminal-fg)' }}>
                <span style={{ color: 'var(--terminal-comment)' }}>+ </span>
                {addon.name}
              </span>
              <span style={{ color: 'var(--terminal-cyan)' }}>{addon.price}</span>
            </div>
          ))}
        </div>
      </TerminalOutput>

      {/* Commission */}
      <CommandLine command="cat services/referral.json" />
      <TerminalOutput delay={400}>
        <div
          className="rounded-sm overflow-hidden"
          style={{ border: '1px solid var(--terminal-border)' }}
        >
          <div
            className="px-4 py-2 text-xs"
            style={{
              background: 'var(--terminal-surface)',
              color: 'var(--terminal-comment)',
              borderBottom: '1px solid var(--terminal-border)',
            }}
          >
            // Refer a client and earn a commission on the final project price
          </div>
          {/* Header */}
          <div
            className="grid text-xs font-bold px-4 py-2"
            style={{
              gridTemplateColumns: '1fr auto',
              background: 'var(--terminal-surface)',
              color: 'var(--terminal-comment)',
              borderBottom: '1px solid var(--terminal-border)',
            }}
          >
            <span>TIER</span>
            <span>COMMISSION</span>
          </div>
          {serviceTiers.map((tier, i) => (
            <div
              key={tier.id}
              className="grid px-4 py-2 text-sm"
              style={{
                gridTemplateColumns: '1fr auto',
                borderBottom: i < serviceTiers.length - 1 ? '1px solid var(--terminal-border)' : 'none',
              }}
            >
              <span style={{ color: 'var(--terminal-fg)' }}>{tier.name}</span>
              <span style={{ color: 'var(--terminal-green)' }}>{tier.commission}</span>
            </div>
          ))}
        </div>
      </TerminalOutput>
    </section>
  );
}

function TierCard({ tier, expanded, onToggle }) {
  return (
    <div
      className="rounded-sm flex flex-col"
      style={{
        background: 'var(--terminal-surface)',
        border: `1px solid ${tier.highlight ? 'var(--terminal-amber)' : 'var(--terminal-border)'}`,
        boxShadow: tier.highlight ? '0 0 12px rgba(255,176,0,0.15)' : 'none',
      }}
    >
      {/* Card header */}
      <div
        className="px-4 py-3"
        style={{
          borderBottom: '1px solid var(--terminal-border)',
          background: tier.highlight ? 'rgba(255,176,0,0.06)' : 'transparent',
        }}
      >
        {tier.highlight && (
          <div
            className="text-xs mb-1 font-bold tracking-wider"
            style={{ color: 'var(--terminal-amber)' }}
          >
            MOST COMPLEX
          </div>
        )}
        <div className="text-sm font-bold mb-1" style={{ color: '#FFFFFF' }}>
          {tier.name}
        </div>
        <div className="text-lg font-bold" style={{ color: 'var(--terminal-cyan)' }}>
          {tier.priceRange}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--terminal-comment)' }}>
          {tier.scope}
        </div>
      </div>

      {/* Features — collapsed on mobile, toggle */}
      <div className="px-4 py-3 flex-1">
        {/* Always show first 2 features */}
        <ul className="space-y-1.5">
          {tier.features.slice(0, 2).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--terminal-fg)' }}>
              <FaCheck className="mt-0.5 shrink-0" style={{ color: 'var(--terminal-green)' }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Remaining features, toggleable */}
        <AnimatePresence initial={false}>
          {expanded && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="space-y-1.5 mt-1.5">
                {tier.features.slice(2).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--terminal-fg)' }}>
                    <FaCheck className="mt-0.5 shrink-0" style={{ color: 'var(--terminal-green)' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </MotionDiv>
          )}
        </AnimatePresence>

        {tier.features.length > 2 && (
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs mt-2 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: 'var(--terminal-comment)' }}
          >
            {expanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            {expanded ? 'less' : `+${tier.features.length - 2} more`}
          </button>
        )}
      </div>

      {/* Commission badge */}
      <div
        className="px-4 py-2 text-xs flex justify-between items-center"
        style={{
          borderTop: '1px solid var(--terminal-border)',
          color: 'var(--terminal-comment)',
        }}
      >
        <span>referral</span>
        <span
          className="px-2 py-0.5 rounded-sm font-bold"
          style={{
            background: 'rgba(57,255,20,0.08)',
            color: 'var(--terminal-green)',
            border: '1px solid rgba(57,255,20,0.2)',
          }}
        >
          {tier.commission}
        </span>
      </div>
    </div>
  );
}
