import { useRef } from 'react';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiLua, SiRoblox, SiCss3, SiHtml5 } from 'react-icons/si';

import { useGitHubStats } from '../hooks/useGitHubStats';
import { projects, featuredProjects, getProjectStats } from '../data/projects';

import TerminalWindow from '../components/terminal/TerminalWindow';
import TerminalPrompt from '../components/terminal/TerminalPrompt';

import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';

const skills = [
    { name: 'React', icon: <FaReact className="text-blue-400" />, category: 'Frontend'},
    { name: 'TypeScript', icon: <SiTypescript className="text-blue-500" />, category: 'Backend'},
    { name: 'HTML', icon: <SiHtml5 className="text-orange-500" />, category: 'Frontend' },
    { name: 'CSS', icon: <SiCss3 className="text-blue-300" />, category: 'Frontend' },
    { name: 'Node.js', icon: <FaNodeJs className="text-green-400" />, category: 'Backend' },
    { name: 'MongoDB', icon: <SiMongodb className="text-green-500" />, category: 'Backend' },
    { name: 'Lua', icon: <SiLua className="text-blue-300" />, category: 'Game Dev' },
    { name: 'Roblox Studio', icon: <SiRoblox className="text-red-500" />, category: 'Game Dev' },
];

export default function LandingPage() {
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const skillsRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);

    const { githubStats } = useGitHubStats();
    const projectStats = getProjectStats();

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const commands = {
        home: { description: 'Go to welcome screen', action: () => scrollTo(heroRef) },
        about: { description: 'Read about me', action: () => scrollTo(aboutRef), aliases: ['cat about.md'] },
        skills: { description: 'View my skills', action: () => scrollTo(skillsRef), aliases: ['tree skills/', 'ls skills/'] },
        projects: { description: 'Browse projects', action: () => scrollTo(projectsRef), aliases: ['ls projects/'] },
        contact: { description: 'Get in touch', action: () => scrollTo(contactRef), aliases: ['mail ethan'] },
        resume: { description: 'Download resume', action: () => alert('Add your resume PDF to /public/resume.pdf') },
    };

    const handleNavigate = (section) => {
        const refs = { home: heroRef, about: aboutRef, skills: skillsRef, projects: projectsRef, contact: contactRef };
        if (refs[section]) scrollTo(refs[section]);
    };

    return (
        <TerminalWindow title="ethan@portfolio: ~">
            <div ref={heroRef}>
                <HeroSection githubStats={githubStats} onNavigate={handleNavigate} />
            </div>

            <div ref={aboutRef}>
                <AboutSection githubStats={githubStats} />
            </div>

            <div ref={skillsRef}>
                <SkillsSection skills={skills} />
            </div>

            <div ref={projectsRef}>
                <ProjectsSection
                    projects={projects}
                    featuredProjects={featuredProjects}
                    projectStats={projectStats}
                />
            </div>

            <div ref={contactRef}>
                <ContactSection />
            </div>

            {/* Footer */}
            <div
                className="py-6 text-center text-xs border-t"
                style={{ color: 'var(--terminal-comment)', borderColor: 'var(--terminal-border)' }}
            >
                <span style={{ color: 'var(--terminal-amber)' }}>ethan@portfolio</span>
                <span>:~$ </span>
                <span>echo "&copy; {new Date().getFullYear()} Ethan. Built with React + Vite."</span>
            </div>

            <TerminalPrompt commands={commands} />
        </TerminalWindow>
    );
}
