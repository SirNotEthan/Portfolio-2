const GITHUB_USERNAME = 'SirNotEthan';
const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  async fetchWithCache(url, cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  async getUserRepos() {
    const url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
    return this.fetchWithCache(url, 'user_repos');
  }

  async getRepoDetails(repoName) {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`;
    return this.fetchWithCache(url, `repo_${repoName}`);
  }

  async getRepoLanguages(repoName) {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`;
    return this.fetchWithCache(url, `languages_${repoName}`);
  }

  async getRepoReadme(repoName) {
    try {
      const url = `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`;
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const data = await response.json();
      return atob(data.content);
    } catch (error) {
      return null;
    }
  }

  formatRepoForPortfolio(repo, languages = {}, readme = null) {
    const languageList = Object.keys(languages);
    const description = repo.description || this.extractDescriptionFromReadme(readme) || "No description available";
    
    return {
      id: repo.id,
      name: repo.name,
      description: description,
      longDescription: readme ? this.extractLongDescriptionFromReadme(readme) : description,
      technologies: this.mapLanguagesToTechnologies(languageList),
      githubLink: repo.html_url,
      link: repo.homepage || repo.html_url,
      status: this.determineStatus(repo),
      category: this.determineCategory(languageList, repo.topics || []),
      featured: false,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      size: repo.size,
      isPrivate: repo.private,
      archived: repo.archived,
      images: [this.generatePlaceholderImage(repo)]
    };
  }

  extractDescriptionFromReadme(readme) {
    if (!readme) return null;
    
    const lines = readme.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      if (line.length > 20 && line.length < 200) {
        return line.trim();
      }
    }
    return null;
  }

  extractLongDescriptionFromReadme(readme) {
    if (!readme) return null;
    
    const sections = readme.split('\n## ');
    if (sections.length > 1) {
      return sections[0].replace(/^# .*?\n/, '').trim().substring(0, 500);
    }
    
    return readme.substring(0, 500).trim();
  }

  mapLanguagesToTechnologies(languages) {
    const techMap = {
      'JavaScript': ['JavaScript', 'Node.js'],
      'TypeScript': ['TypeScript', 'Node.js'],
      'Python': ['Python'],
      'Java': ['Java'],
      'C++': ['C++'],
      'C#': ['C#'],
      'PHP': ['PHP'],
      'Ruby': ['Ruby'],
      'Go': ['Go'],
      'Rust': ['Rust'],
      'Swift': ['Swift'],
      'Kotlin': ['Kotlin'],
      'Dart': ['Dart', 'Flutter'],
      'HTML': ['HTML', 'CSS'],
      'CSS': ['CSS'],
      'SCSS': ['SCSS', 'CSS'],
      'Vue': ['Vue.js'],
      'Svelte': ['Svelte'],
      'Lua': ['Lua']
    };

    const technologies = new Set();
    languages.forEach(lang => {
      const mapped = techMap[lang] || [lang];
      mapped.forEach(tech => technologies.add(tech));
    });

    return Array.from(technologies);
  }

  determineCategory(languages, topics) {
    const topicsLower = topics.map(t => t.toLowerCase());
    const languagesLower = languages.map(l => l.toLowerCase());

    if (topicsLower.some(t => ['game', 'roblox', 'unity', 'gamedev'].includes(t)) || 
        languagesLower.includes('lua')) {
      return 'Game Development';
    }

    if (topicsLower.some(t => ['3d', 'blender', 'modeling', 'graphics'].includes(t))) {
      return '3D Modeling';
    }

    if (topicsLower.some(t => ['bot', 'discord', 'api', 'backend', 'server'].includes(t)) ||
        languagesLower.some(l => ['javascript', 'typescript', 'python', 'php', 'node'].includes(l))) {
      return 'Web Development';
    }

    if (topicsLower.some(t => ['mobile', 'android', 'ios', 'flutter', 'react-native'].includes(t))) {
      return 'Mobile Development';
    }

    return 'Web Development';
  }

  determineStatus(repo) {
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    
    if (repo.archived) return 'Archived';
    if (daysSinceUpdate < 30) return 'In Progress';
    if (daysSinceUpdate < 90) return 'Completed';
    return 'Completed';
  }

  generatePlaceholderImage(repo) {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD'];
    const color = colors[repo.id % colors.length];
    return `https://via.placeholder.com/1280x720/${color}/FFFFFF?text=${encodeURIComponent(repo.name)}`;
  }

  async getPortfolioProjects(selectedRepos = []) {
    try {
      const repos = await this.getUserRepos();
      const filteredRepos = selectedRepos.length > 0 
        ? repos.filter(repo => selectedRepos.includes(repo.name))
        : repos.filter(repo => !repo.private && !repo.fork);

      const projects = await Promise.all(
        filteredRepos.map(async (repo) => {
          try {
            const [languages, readme] = await Promise.all([
              this.getRepoLanguages(repo.name),
              this.getRepoReadme(repo.name)
            ]);
            return this.formatRepoForPortfolio(repo, languages, readme);
          } catch (error) {
            console.warn(`Error processing repo ${repo.name}:`, error);
            return this.formatRepoForPortfolio(repo);
          }
        })
      );

      return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      return [];
    }
  }

  async getAllRepos() {
    try {
      const repos = await this.getUserRepos();
      return repos
        .filter(repo => !repo.private)
        .map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics || [],
          updatedAt: repo.updated_at,
          url: repo.html_url,
          archived: repo.archived
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('Error fetching all repos:', error);
      return [];
    }
  }
}

export default new GitHubService();