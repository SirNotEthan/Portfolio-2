import { Link } from 'react-scroll';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaDiscord, FaReact, FaNodeJs, FaGithub, FaDocker, FaCss3, FaExternalLinkAlt, FaCode, FaRocket, FaLightbulb, FaGamepad, FaCube, FaFilter, FaStar, FaEye, FaCog } from 'react-icons/fa';
import { SiTailwindcss, SiPostgresql, SiJavascript, SiTypescript, SiHtml5, SiMongodb, SiDiscord, SiLua, SiBlender, SiRoblox } from 'react-icons/si';
import { HiMenu, HiX } from 'react-icons/hi';
import { useGitHubProjects } from '../hooks/useGitHubProjects';
import AdminPanel from '../components/AdminPanel';
import authService from '../services/authService';

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const horizontalContainerRef = useRef(null);
    const [projectImageIndices, setProjectImageIndices] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [githubStats, setGithubStats] = useState(null);
    const [currentSection, setCurrentSection] = useState(0);
    const sectionsRef = useRef([]);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const {
        projects: githubProjects,
        loading: projectsLoading,
        getFeaturedProjects,
        getProjectsByCategory,
        getProjectStats
    } = useGitHubProjects();

    const sections = ['home', 'about', 'skills', 'featured', 'projects', 'contact'];

    const scrollToSection = (sectionIndex) => {
        const container = horizontalContainerRef.current;
        
        if (container) {
            const sectionWidth = window.innerWidth;
            const targetScrollLeft = sectionIndex * sectionWidth;

            setCurrentSection(sectionIndex);
            setActiveSection(sections[sectionIndex]);

            container.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const container = horizontalContainerRef.current;
            if (container) {
                const scrollLeft = container.scrollLeft;
                const sectionWidth = window.innerWidth;
                const newSection = Math.round(scrollLeft / sectionWidth);
                if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
                    setCurrentSection(newSection);
                    setActiveSection(sections[newSection]);
                }
            }
        };

        const container = horizontalContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [currentSection, sections]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowRight' && currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            } else if (e.key === 'ArrowLeft' && currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentSection, sections.length]);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const handleAdminAccess = () => {
        if (authService.isAuthenticated()) {
            setShowAdminPanel(true);
        } else {
            setShowAdminLogin(true);
        }
    };

    const handleAdminLogin = (password) => {
        // Simple password check - in production, this should be more secure
        const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('portfolio_admin_auth', 'true');
            sessionStorage.setIte
            m('portfolio_admin_auth_time', Date.now().toString());
            
            setIsAuthenticated(true);
            setShowAdminLogin(false);
            setShowAdminPanel(true);
            authService.logAccessAttempt(true);
        } else {
            authService.logAccessAttempt(false);
            alert('Invalid password');
        }
    };


    const skills = [
        { name: 'React', icon: <FaReact className="text-blue-400 text-6xl" />, category: 'Frontend', glow: 'glow-effect' },
        { name: 'Node.js', icon: <FaNodeJs className="text-green-400 text-6xl" />, category: 'Backend', glow: 'glow-effect' },
        { name: 'JavaScript', icon: <SiJavascript className="text-yellow-400 text-6xl" />, category: 'Language', glow: 'glow-effect' },
        { name: 'TypeScript', icon: <SiTypescript className="text-blue-500 text-6xl" />, category: 'Language', glow: 'glow-effect' },
        { name: 'Lua', icon: <SiLua className="text-blue-300 text-6xl" />, category: 'Language', glow: 'glow-effect' },
        { name: 'HTML 5', icon: <SiHtml5 className="text-orange-500 text-6xl" />, category: 'Frontend', glow: 'glow-effect-red' },
        { name: 'CSS 3', icon: <FaCss3 className="text-blue-500 text-6xl" />, category: 'Styling', glow: 'glow-effect' },
        { name: 'TailwindCSS', icon: <SiTailwindcss className="text-teal-400 text-6xl" />, category: 'Styling', glow: 'glow-effect' },
        { name: 'MongoDB', icon: <SiMongodb className="text-green-500 text-6xl" />, category: 'Database', glow: 'glow-effect' },
        { name: 'PostgreSQL', icon: <SiPostgresql className="text-blue-300 text-6xl" />, category: 'Database', glow: 'glow-effect' },
        { name: 'Discord.js', icon: <SiDiscord className="text-indigo-400 text-6xl" />, category: 'Framework', glow: 'glow-effect-purple' },
        { name: 'Roblox Studio', icon: <SiRoblox className="text-red-500 text-6xl" />, category: 'Game Dev', glow: 'glow-effect-red' },
        { name: 'Blender', icon: <SiBlender className="text-orange-400 text-6xl" />, category: '3D Modeling', glow: 'glow-effect-red' },
        { name: 'GitHub', icon: <FaGithub className="text-gray-300 text-6xl" />, category: 'Tools', glow: 'glow-effect' },
        { name: 'Docker', icon: <FaDocker className="text-blue-500 text-6xl" />, category: 'DevOps', glow: 'glow-effect' },
        { name: 'Game Design', icon: <FaGamepad className="text-purple-400 text-6xl" />, category: 'Game Dev', glow: 'glow-effect-purple' },
    ];

    const projects = githubProjects.length > 0 ? githubProjects : [
        {
            id: 'fallback-1',
            name: "GitHub Integration Loading...",
            description: "Loading projects from GitHub...",
            longDescription: "Your projects will be loaded automatically from your GitHub repositories.",
            images: ["https://via.placeholder.com/1280x720/4ECDC4/FFFFFF?text=Loading"],
            technologies: ['GitHub API', 'React'],
            link: "#",
            githubLink: "https://github.com/SirNotEthan",
            status: 'Loading',
            category: 'Web Development',
            featured: false
        }
    ];

    const projectCategories = ['All', 'Web Development', 'Game Development', '3D Modeling'];
    
    const filteredProjects = selectedCategory === 'All' 
        ? projects 
        : projects.filter(project => project.category === selectedCategory);

    const featuredProjects = projects.filter(project => project.featured);
    const projectStats = getProjectStats();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });


    const webhookURL = "https://discord.com/api/webhooks/1345817746583060520/XDfTWRU2XiKQAc5stGLFdsLxELU6Gim63Sti7E-ThVjbBO5r-n86tB8uyay7UvwRkVV3";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const discordMessage = {
            embeds: [
                {
                    title: "📩 New Contact Form Submission",
                    color: 3447003, 
                    fields: [
                        {
                            name: "👤 Name",
                            value: formData.name || "No Name Provided",
                            inline: true
                        },
                        {
                            name: "📧 Email",
                            value: formData.email || "No Email Provided",
                            inline: true
                        },
                        {
                            name: "💬 Message",
                            value: formData.message || "No Message Provided"
                        }
                    ],
                    footer: {
                        text: "Contact Form Submission"
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };
        try {
            await fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(discordMessage)
            });

            alert("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error Sending Message:", error);
            alert("Failed to send message. Please try again later.");
        }
    };

    return (
        <div ref={containerRef} className="bg-dark-gradient relative">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div 
                    className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                        transition: 'all 0.3s ease-out'
                    }}
                />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Header Section */}
            <motion.header 
                className="fixed top-0 w-full z-50 backdrop-blur-strong bg-black/20 border-b border-gray-800/50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.h1 
                            className="text-white text-2xl font-bold text-glow"
                            whileHover={{ scale: 1.05 }}
                        >
                            SirNotEthan
                        </motion.h1>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-6 items-center">
                            {sections.map((item, index) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(index)}
                                    className={`text-gray-300 hover:text-white transition-all cursor-pointer relative group ${
                                        currentSection === index ? 'text-blue-400' : ''
                                    }`}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full" />
                                </button>
                            ))}
                            <button
                                onClick={handleAdminAccess}
                                className="text-gray-400 hover:text-blue-400 text-xl transition-all transform hover:scale-110"
                                title="Admin Panel"
                            >
                                <FaCog />
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white text-2xl"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <HiX /> : <HiMenu />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.nav
                                className="md:hidden mt-4 pb-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {sections.map((item, index) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            scrollToSection(index);
                                            setIsMenuOpen(false);
                                        }}
                                        className="block text-gray-300 hover:text-blue-400 py-2 transition-colors cursor-pointer w-full text-left"
                                    >
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        handleAdminAccess();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 py-2 transition-colors cursor-pointer w-full text-left"
                                >
                                    <FaCog /> Admin Panel
                                </button>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            {/* Horizontal Scrolling Container */}
            <div ref={horizontalContainerRef} className="horizontal-container">
                {/* Hero Section */}
                <section id="home" ref={el => sectionsRef.current[0] = el} className="horizontal-section relative flex items-center justify-center bg-hero-gradient">
                <div className="container mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            className="text-center lg:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <motion.h1 
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.4 }}
                            >
                                Full-Stack
                                <span className="text-blue-400 text-shadow-glow block animate-pulse-glow">Developer</span>
                                <motion.span 
                                    className="text-lg md:text-xl font-normal text-gray-400 block mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 1.2 }}
                                >
                                    Web • Game • 3D • Discord Bots
                                </motion.span>
                            </motion.h1>
                            
                            <motion.p 
                                className="text-xl text-gray-300 mb-8 max-w-lg"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.6 }}
                            >
                                Crafting immersive digital experiences with cutting-edge technologies and innovative solutions.
                            </motion.p>

                            <motion.div 
                                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.8 }}
                            >
                                <button
                                    onClick={() => scrollToSection(4)}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg glow-effect transition-all cursor-pointer flex items-center gap-2"
                                >
                                    <FaRocket /> View Projects
                                </button>
                                <button
                                    onClick={() => scrollToSection(5)}
                                    className="px-8 py-3 border border-gray-600 hover:border-blue-400 text-white rounded-lg transition-all cursor-pointer flex items-center gap-2"
                                >
                                    <FaLightbulb /> Get In Touch
                                </button>
                            </motion.div>

                            <motion.div 
                                className="flex space-x-6 justify-center lg:justify-start"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1 }}
                            >
                                <a href="https://x.com/SirNotEthan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 text-3xl transition-all transform hover:scale-110 glow-effect">
                                    <FaTwitter />
                                </a>
                                <a href="https://discordapp.com/users/959555371385622590" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 text-3xl transition-all transform hover:scale-110 glow-effect-purple">
                                    <FaDiscord />
                                </a>
                                <a href="https://github.com/SirNotEthan" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-3xl transition-all transform hover:scale-110 glow-effect">
                                    <FaGithub />
                                </a>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            <div className="relative w-80 h-80 mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-glow" />
                                <img
                                    src="https://pbs.twimg.com/profile_images/1692994137081950213/xEwyKITA_400x400.jpg"
                                    alt="Ethan"
                                    className="relative w-full h-full object-cover rounded-full border-4 border-gray-800 animate-float"
                                />
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div 
                        className="absolute bottom-8 right-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                    >
                        <motion.div 
                            className="flex items-center text-gray-400 cursor-pointer hover:text-blue-400 transition-colors"
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            onClick={() => scrollToSection(1)}
                        >
                            <span className="text-sm mr-2">Scroll to explore</span>
                            <div className="w-10 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                                <motion.div 
                                    className="w-3 h-1 bg-blue-400 rounded-full"
                                    animate={{ x: [0, 12, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                </section>

                {/* About Section */}
                <section id="about" ref={el => sectionsRef.current[1] = el} className="horizontal-section py-20 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">About Me</h2>
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                            Passionate developer from the UK, dedicated to creating exceptional digital experiences
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <FaCode />, title: 'Clean Code', desc: 'Writing maintainable, scalable, and efficient code' },
                            { icon: <FaRocket />, title: 'Performance', desc: 'Optimizing for speed and user experience' },
                            { icon: <FaLightbulb />, title: 'Innovation', desc: 'Exploring new technologies and creative solutions' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-card-gradient p-8 rounded-xl glow-effect hover:glow-effect-purple transition-all"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-blue-400 text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-300">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="horizontal-section py-20 bg-dark-gradient">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">Skills & Technologies</h2>
                        <p className="text-gray-300 text-xl">My technical expertise and tools</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                className={`bg-card-gradient p-6 rounded-xl text-center hover:${skill.glow} transition-all transform hover:scale-105`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="mb-4">{skill.icon}</div>
                                <h3 className="text-white font-bold text-lg mb-1">{skill.name}</h3>
                                <p className="text-gray-400 text-sm">{skill.category}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                </section>

                {/* Featured Projects Section */}
                <section id="featured" className="horizontal-section py-20 bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">Featured Projects</h2>
                        <p className="text-gray-300 text-xl">My most notable and impactful work</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProjects.map((project, index) => {
                            const currentImage = projectImageIndices[project.id] || 0;
                            const setCurrentImage = (imageIndex) => {
                                setProjectImageIndices(prev => ({
                                    ...prev,
                                    [project.id]: imageIndex
                                }));
                            };
                            return (
                                <motion.div
                                    key={project.id}
                                    className="bg-card-gradient rounded-xl overflow-hidden glow-effect hover:glow-effect-purple transition-all group relative"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="absolute top-4 right-4 z-10">
                                        <FaStar className="text-yellow-400 text-xl" />
                                    </div>
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={project.images[currentImage]} 
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                project.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                                                project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        {project.images.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                {project.images.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        className={`w-3 h-3 rounded-full transition-all ${
                                                            i === currentImage ? 'bg-blue-400' : 'bg-gray-500 hover:bg-gray-400'
                                                        }`}
                                                        onClick={() => setCurrentImage(i)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-white text-xl font-bold">{project.name}</h3>
                                            <span className="text-blue-400 text-sm">{project.category}</span>
                                        </div>
                                        
                                        <p className="text-gray-300 mb-4">{project.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-3">
                                            <a 
                                                href={project.link} 
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all glow-effect"
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                <FaExternalLinkAlt className="text-sm" /> 
                                                {project.category === 'Game Development' ? 'Play Game' : 
                                                 project.category === '3D Modeling' ? 'View Gallery' : 'Live Demo'}
                                            </a>
                                            <a 
                                                href={project.githubLink} 
                                                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-blue-400 text-white rounded-lg transition-all"
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                <FaGithub /> Code
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
                </section>

                {/* All Projects Section */}
                <section id="projects" className="horizontal-section py-20 bg-dark-gradient">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">All Projects</h2>
                        <p className="text-gray-300 text-xl">Complete portfolio of my work across different domains</p>
                    </motion.div>

                    {/* Project Filter */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-4 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {projectCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white glow-effect'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <FaFilter className="text-sm" />
                                {category}
                                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                    {category === 'All' ? projects.length : projects.filter(p => p.category === category).length}
                                </span>
                            </button>
                        ))}
                    </motion.div>

                    {/* GitHub Stats Card */}
                    <motion.div 
                        className="bg-card-gradient p-6 rounded-xl glow-effect mb-12 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid md:grid-cols-4 gap-6 text-center">
                            <div>
                                <FaGithub className="text-4xl text-gray-300 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-white">{projectStats.total || projects.length}</h3>
                                <p className="text-gray-400">Total Projects</p>
                            </div>
                            <div>
                                <FaStar className="text-4xl text-yellow-400 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-white">{projectStats.totalStars || 0}</h3>
                                <p className="text-gray-400">GitHub Stars</p>
                            </div>
                            <div>
                                <FaCode className="text-4xl text-blue-400 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-white">{projectStats.languages?.length || '5+'}</h3>
                                <p className="text-gray-400">Languages</p>
                            </div>
                            <div>
                                <FaEye className="text-4xl text-purple-400 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-white">{featuredProjects.length}</h3>
                                <p className="text-gray-400">Featured</p>
                            </div>
                        </div>
                        {projectsLoading && (
                            <div className="text-center mt-4">
                                <div className="text-blue-400 animate-pulse">Loading projects from GitHub...</div>
                            </div>
                        )}
                    </motion.div>

                    {/* Projects Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedCategory}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {filteredProjects.map((project, index) => {
                                const currentImage = projectImageIndices[project.id] || 0;
                                const setCurrentImage = (imageIndex) => {
                                    setProjectImageIndices(prev => ({
                                        ...prev,
                                        [project.id]: imageIndex
                                    }));
                                };
                                return (
                                    <motion.div
                                        key={project.id}
                                        className="bg-card-gradient rounded-xl overflow-hidden glow-effect hover:glow-effect-purple transition-all group"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img 
                                                src={project.images[currentImage]} 
                                                alt={project.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    project.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                                                    project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {project.status}
                                                </span>
                                                {project.featured && (
                                                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-1">
                                                        <FaStar className="text-xs" /> Featured
                                                    </span>
                                                )}
                                            </div>
                                            {project.images.length > 1 && (
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                    {project.images.map((_, i) => (
                                                        <button
                                                            key={i}
                                                            className={`w-3 h-3 rounded-full transition-all ${
                                                                i === currentImage ? 'bg-blue-400' : 'bg-gray-500 hover:bg-gray-400'
                                                            }`}
                                                            onClick={() => setCurrentImage(i)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-white text-xl font-bold">{project.name}</h3>
                                                <span className="text-blue-400 text-sm">{project.category}</span>
                                            </div>
                                            
                                            <p className="text-gray-300 mb-4">{project.description}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies.map((tech, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <a 
                                                    href={project.link} 
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all glow-effect"
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <FaExternalLinkAlt className="text-sm" /> 
                                                    {project.category === 'Game Development' ? 'Play Game' : 
                                                     project.category === '3D Modeling' ? 'View Gallery' : 'Live Demo'}
                                                </a>
                                                <a 
                                                    href={project.githubLink} 
                                                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-blue-400 text-white rounded-lg transition-all"
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <FaGithub /> Code
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="horizontal-section py-20 bg-dark-gradient">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">Get In Touch</h2>
                        <p className="text-gray-300 text-xl">Ready to collaborate? Let's create something amazing together</p>
                    </motion.div>

                    <div className="max-w-2xl mx-auto">
                        <motion.form
                            onSubmit={handleSubmit}
                            className="bg-card-gradient p-8 rounded-xl glow-effect"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-300 font-semibold mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="message" className="block text-gray-300 font-semibold mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    placeholder="Tell me about your project..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                                    required
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all glow-effect transform hover:scale-105"
                                whileTap={{ scale: 0.95 }}
                            >
                                Send Message
                            </motion.button>
                        </motion.form>
                    </div>
                    </div>
                </section>
            </div>

            {/* Horizontal Navigation Dots */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
                {sections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSection(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            currentSection === index ? 'bg-blue-400 scale-125' : 'bg-gray-500 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>


            {/* Navigation Hints */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="text-gray-400 text-sm text-right space-y-1">
                    <p>© 2024 SirNotEthan</p>
                    <p className="text-xs">Use ← → keys or scroll horizontally</p>
                </div>
            </div>

            {/* Navigation Arrows */}
            {currentSection > 0 && (
                <button
                    onClick={() => scrollToSection(currentSection - 1)}
                    className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
                >
                    <span className="text-xl">←</span>
                </button>
            )}
            
            {currentSection < sections.length - 1 && (
                <button
                    onClick={() => scrollToSection(currentSection + 1)}
                    className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
                >
                    <span className="text-xl">→</span>
                </button>
            )}

            {/* Admin Login Modal */}
            <AnimatePresence>
                {showAdminLogin && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-card-gradient rounded-xl p-8 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <FaCog className="text-blue-400" />
                                    Admin Access
                                </h2>
                                <button
                                    onClick={() => setShowAdminLogin(false)}
                                    className="text-gray-400 hover:text-white text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const password = e.target.password.value;
                                    handleAdminLogin(password);
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-gray-300 font-semibold mb-2">
                                        Admin Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter admin password"
                                        className="w-full px-4 py-3 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all glow-effect transform hover:scale-105"
                                >
                                    Access Admin Panel
                                </button>
                            </form>
                            <p className="text-gray-400 text-sm mt-4 text-center">
                                Authorized personnel only
                            </p>
                        </motion.div>
                    </motion.div>
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
        </div>
    );
}

export default LandingPage;