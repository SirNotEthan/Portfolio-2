export const projects = [
  {
    id: 1,
    name: 'StudentLens',
    description: 'Student News Site.',
    technologies: ['React', 'Node.js', 'CSS', 'Appwrite', 'Typescript'],
    githubLink: 'https://github.com/SirNotEthan/StudentLens',
    link: 'https://studentlens.net/',
    status: 'Completed',
    category: 'Web Development',
    featured: true,
    stars: 0,
    forks: 0,
    language: 'React, CSS, Typescript',
    images: ['/images/studentlens/login.png', '/images/studentlens/main-page-one.png', '/images/studentlens/main-page-two.png', '/images/studentlens/article.png',  '/images/studentlens/profile.png', '/images/studentlens/settings.png', '/images/studentlens/user-management.png', '/images/studentlens/write-article.png', '/images/studentlens/wordle.png' ],
    updatedAt: '2025-09-10',
  },
  {
    id: 2,
    name: 'Developer Connections Site',
    description: 'A Peronsal Site Project where Developers are able to connect easier.',
    technologies: ['React', 'Node.js', 'Typescript', 'PostgreSQL', 'PrismaORM'],
    githubLink: 'https://github.com/SirNotEthan/DevConnect',
    link: '',
    status: 'In Progress',
    category: 'Web Development',
    featured: true,
    stars: 0,
    forks: 0,
    language: 'React, TypeScript',
    images: [],
    updatedAt: '2026-02-09',
  },
  {
    id: 3,
    name: 'Listeria Discord Bot',
    description: 'The Former Listeria Vouch Bot. This Project No Longer Exists on Discord.',
    technologies: ['Node.js', 'Typescript'],
    githubLink: 'https://github.com/SirNotEthan/Nexius-Bot',
    link: '',
    status: 'Completed',
    category: 'Web Development',
    featured: true,
    stars: 0,
    forks: 0,
    language: 'Typescript',
    images: ['/images/listeria/image-one.png', '/images/listeria/image-two.png', '/images/listeria/image-three.png', '/images/listeria/image-four.png', '/images/listeria/image-five.png'],
    updatedAt: '2026-01-31',
  },
  {
    id: 4,
    name: 'Stud UI Showcase',
    description: 'Roblox Stud User Interface Design',
    technologies: ['Affinity'],
    githubLink: 'https://github.com/SirNotEthan/Nexius-Bot',
    link: '',
    status: 'In Progress',
    category: 'Game Development',
    featured: false,
    stars: 0,
    forks: 0,
    language: 'Affinity',
    images: ['/images/ui-showcase/preview.png'],
    updatedAt: '2026-01-31',
  },
  {
    id: 5,
    name: 'Lua Code Analyzer',
    description: 'A Lua Code Analyzer for Roblox Developers.',
    technologies: ['Node.js', 'Javascript', 'HTML', 'CSS'],
    githubLink: 'https://github.com/SirNotEthan/Lua-Code-Analyzer',
    link: 'https://lua-code-analyzer.pages.dev/',
    status: 'Staggered Development',
    category: 'Web Development',
    featured: false,
    stars: 0,
    forks: 0,
    language: 'Javascript, HTML, CSS',
    images: ['/images/lua-analyzer/preview.png', '/images/lua-analyzer/image.png'],
    updatedAt: '2025-12-15',
  }
];

export const featuredProjects = projects.filter(p => p.featured);

export function getProjectStats() {
  const stats = {
    total: projects.length,
    byCategory: {},
    byStatus: {},
    totalStars: 0,
    totalForks: 0,
    languages: [],
    featured: 0,
  };

  const langSet = new Set();

  projects.forEach(project => {
    stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
    stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
    stats.totalStars += project.stars || 0;
    stats.totalForks += project.forks || 0;
    if (project.language) langSet.add(project.language);
    if (project.featured) stats.featured++;
  });

  stats.languages = Array.from(langSet);
  return stats;
}
