import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiLua, SiRoblox } from 'react-icons/si';

import { useGitHubProjects } from '../hooks/useGitHubProjects';
import authService from '../services/authService';

import TerminalWindow from '../components/terminal/TerminalWindow';
import TerminalPrompt from '../components/terminal/TerminalPrompt';

import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';

import AdminPanel from '../components/AdminPanel';

const skills = [
    { name: 'React', icon: <FaReact className="text-blue-400" />, category: 'Frontend', years: 4 },
    { name: 'TypeScript', icon: <SiTypescript className="text-blue-500" />, category: 'Frontend', years: 3 },
    { name: 'Node.js', icon: <FaNodeJs className="text-green-400" />, category: 'Backend', years: 4 },
    { name: 'MongoDB', icon: <SiMongodb className="text-green-500" />, category: 'Backend', years: 3 },
    { name: 'Lua', icon: <SiLua className="text-blue-300" />, category: 'Game Dev', years: 5 },
    { name: 'Roblox Studio', icon: <SiRoblox className="text-red-500" />, category: 'Game Dev', years: 5 },
];

export default function LandingPage() {
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const skillsRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);

    const {
        projects: githubProjects,
        loading: projectsLoading,
        githubStats,
        getProjectStats
    } = useGitHubProjects();

    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const projects = githubProjects.length > 0 ? githubProjects : [];
    const featuredProjects = projects.filter(p => p.featured);
    const projectStats = getProjectStats();

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAdminAccess = () => {
        if (authService.isAuthenticated()) {
            setShowAdminPanel(true);
        } else {
            setShowAdminLogin(true);
        }
    };

    const handleAdminLogin = (password) => {
        const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('portfolio_admin_auth', 'true');
            sessionStorage.setItem('portfolio_admin_auth_time', Date.now().toString());
            setIsAuthenticated(true);
            setShowAdminLogin(false);
            setShowAdminPanel(true);
            authService.logAccessAttempt(true);
        } else {
            authService.logAccessAttempt(false);
            alert('Invalid password');
        }
    };

    const commands = {
        home:     { description: 'Go to welcome screen', action: () => scrollTo(heroRef) },
        about:    { description: 'Read about me', action: () => scrollTo(aboutRef), aliases: ['cat about.md'] },
        skills:   { description: 'View my skills', action: () => scrollTo(skillsRef), aliases: ['tree skills/', 'ls skills/'] },
        projects: { description: 'Browse projects', action: () => scrollTo(projectsRef), aliases: ['ls projects/'] },
        contact:  { description: 'Get in touch', action: () => scrollTo(contactRef), aliases: ['mail ethan'] },
        resume:   { description: 'Download resume', action: () => alert('Add your resume PDF to /public/resume.pdf') },
        admin:    { description: 'Admin panel', action: handleAdminAccess, aliases: ['sudo su'] },
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
                    projectsLoading={projectsLoading}
                    githubStats={githubStats}
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

            {/* Admin Login Modal */}
            <AnimatePresence>
                {showAdminLogin && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(4px)' }}
                    >
                        <div
                            className="w-full max-w-md p-6 rounded-sm"
                            style={{
                                background: 'var(--terminal-surface)',
                                border: '1px solid var(--terminal-border)'
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold" style={{ color: 'var(--terminal-amber)' }}>
                                    $ sudo su - admin
                                </h2>
                                <button
                                    onClick={() => setShowAdminLogin(false)}
                                    className="hover:opacity-80 text-lg cursor-pointer"
                                    style={{ color: 'var(--terminal-comment)' }}
                                >
                                    x
                                </button>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAdminLogin(e.target.password.value);
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm mb-1" style={{ color: 'var(--terminal-comment)' }}>
                                        password:
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter admin password"
                                        className="w-full px-3 py-2 terminal-input rounded-sm"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 rounded-sm font-bold text-sm transition-all cursor-pointer hover:opacity-90"
                                    style={{ background: 'var(--terminal-amber)', color: '#000' }}
                                >
                                    $ authenticate
                                </button>
                            </form>
                            <p className="text-xs mt-3 text-center" style={{ color: 'var(--terminal-comment)' }}>
                                Authorized personnel only
                            </p>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Admin Panel */}
            <AnimatePresence>
                {showAdminPanel && isAuthenticated && (
                    <AdminPanel
                        isOpen={showAdminPanel}
                        onClose={() => setShowAdminPanel(false)}
                    />
                )}
            </AnimatePresence>
        </TerminalWindow>
    );
}
