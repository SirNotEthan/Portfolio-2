import { useState } from 'react';
import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';

export default function SkillsSection({ skills }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  // Group skills by category
  const grouped = {};
  skills.forEach((skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  });
  const categories = Object.keys(grouped);

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <section className="py-16">
      <CommandLine command="tree skills/" />
      <TerminalOutput delay={600}>
        <div className="max-w-2xl text-sm">
          <div style={{ color: 'var(--terminal-cyan)' }} className="mb-2 font-bold">skills/</div>

          {categories.map((cat, catIdx) => {
            const isLast = catIdx === categories.length - 1;
            const branch = isLast ? '└── ' : '├── ';
            const pipe = isLast ? '    ' : '│   ';
            const catSkills = grouped[cat];
            const isCollapsed = expandedCategories[cat] === false; // default expanded

            return (
              <div key={cat}>
                {/* Category line */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="hover:opacity-80 transition-opacity cursor-pointer flex"
                >
                  <span style={{ color: 'var(--terminal-border)' }}>{branch}</span>
                  <span style={{ color: 'var(--terminal-cyan)' }} className="font-bold">
                    {cat.toLowerCase().replace(/\s+/g, '-')}/
                  </span>
                  <span
                    className="ml-2 text-xs md:hidden"
                    style={{ color: 'var(--terminal-comment)' }}
                  >
                    {isCollapsed ? '[+]' : '[-]'}
                  </span>
                </button>

                {/* Skills in this category */}
                {!isCollapsed && catSkills.map((skill, skillIdx) => {
                  const isLastSkill = skillIdx === catSkills.length - 1;
                  const skillBranch = isLastSkill ? '└── ' : '├── ';

                  return (
                    <div key={skill.name} className="flex items-center">
                      <span style={{ color: 'var(--terminal-border)' }}>
                        {pipe}{skillBranch}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-base">{skill.icon}</span>
                        <span style={{ color: 'var(--terminal-fg)' }}>{skill.name}</span>
                      </span>
                      <span className="ml-auto pl-4 text-xs" style={{ color: 'var(--terminal-comment)' }}>
                        {skill.years}+ yrs
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Summary */}
          <div className="mt-4" style={{ color: 'var(--terminal-comment)' }}>
            {skills.length} skills, {categories.length} categories
          </div>
        </div>
      </TerminalOutput>
    </section>
  );
}
