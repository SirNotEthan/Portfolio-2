const GITHUB_USERNAME = 'SirNotEthan';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// GitHub Service initialized
console.log(`GitHub Service: Token ${GITHUB_TOKEN ? 'loaded' : 'missing'} for ${GITHUB_USERNAME}`);

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

    const headers = {};
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        if (response.status === 403) {
          const rateLimitReset = response.headers.get('X-RateLimit-Reset');
          const resetTime = rateLimitReset ? new Date(rateLimitReset * 1000) : null;
          throw new Error(`GitHub API rate limit exceeded. ${resetTime ? `Resets at ${resetTime.toLocaleTimeString()}` : 'Try again later.'}`);
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to GitHub API');
      }
      throw error;
    }
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
      const headers = {};
      if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
      }
      
      const response = await fetch(url, { headers });
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
    
    // Generate SVG placeholder to avoid network dependency
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <rect width="1280" height="720" fill="#${color}"/>
      <text x="640" y="360" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">${repo.name}</text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
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
          createdAt: repo.created_at,
          url: repo.html_url,
          archived: repo.archived,
          size: repo.size,
          openIssues: repo.open_issues_count,
          watchers: repo.watchers_count,
          hasWiki: repo.has_wiki,
          hasPages: repo.has_pages,
          defaultBranch: repo.default_branch
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('Error fetching all repos:', error);
      return [];
    }
  }

  async getRepoCommitStats(repoName) {
    try {
      const url = `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/stats/participation`;
      return this.fetchWithCache(url, `commits_${repoName}`);
    } catch (error) {
      console.warn(`Error fetching commit stats for ${repoName}:`, error);
      return null;
    }
  }

  async getUserStats() {
    try {
      const [userInfo, repos] = await Promise.all([
        this.fetchWithCache(`${GITHUB_API_BASE}/user`, 'user_info'),
        this.getUserRepos()
      ]);

      const publicRepos = repos.filter(repo => !repo.private);
      const totalStars = publicRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      const totalForks = publicRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
      const languages = [...new Set(publicRepos.map(repo => repo.language).filter(Boolean))];
      const totalSize = publicRepos.reduce((sum, repo) => sum + (repo.size || 0), 0);

      return {
        username: userInfo.login,
        name: userInfo.name,
        bio: userInfo.bio,
        location: userInfo.location,
        company: userInfo.company,
        blog: userInfo.blog,
        twitterUsername: userInfo.twitter_username,
        publicRepos: userInfo.public_repos,
        publicGists: userInfo.public_gists,
        followers: userInfo.followers,
        following: userInfo.following,
        createdAt: userInfo.created_at,
        updatedAt: userInfo.updated_at,
        avatarUrl: userInfo.avatar_url,
        totalStars,
        totalForks,
        languages,
        totalSize,
        recentActivity: this.calculateRecentActivity(publicRepos)
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  calculateRecentActivity(repos) {
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = now - (90 * 24 * 60 * 60 * 1000);

    const recentlyUpdated = repos.filter(repo => 
      new Date(repo.updated_at).getTime() > oneMonthAgo
    ).length;

    const activeRepos = repos.filter(repo => 
      new Date(repo.updated_at).getTime() > threeMonthsAgo
    ).length;

    return {
      recentlyUpdated,
      activeRepos,
      totalRepos: repos.length
    };
  }
}

export default new GitHubService();