class PortfolioConfigService {
  constructor() {
    this.storageKey = 'portfolio_config';
    this.init();
  }

  init() {
    if (!this.getConfig()) {
      this.setDefaultConfig();
    }
  }

  setDefaultConfig() {
    const defaultConfig = {
      selectedRepos: [],
      featuredRepos: [],
      hiddenRepos: [],
      customProjects: [],
      lastSync: null,
      autoSync: true,
      syncInterval: 3600000,
      categories: {
        'Web Development': true,
        'Game Development': true,
        '3D Modeling': true,
        'Mobile Development': true
      },
      displaySettings: {
        showStats: true,
        showLanguages: true,
        showTopics: true,
        maxProjectsPerCategory: null
      }
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(defaultConfig));
    return defaultConfig;
  }

  getConfig() {
    try {
      const config = localStorage.getItem(this.storageKey);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('Error parsing portfolio config:', error);
      return null;
    }
  }

  updateConfig(updates) {
    const currentConfig = this.getConfig() || this.setDefaultConfig();
    const newConfig = { ...currentConfig, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(newConfig));
    return newConfig;
  }

  addSelectedRepo(repoName) {
    const config = this.getConfig();
    if (!config.selectedRepos.includes(repoName)) {
      config.selectedRepos.push(repoName);
      this.updateConfig(config);
    }
  }

  removeSelectedRepo(repoName) {
    const config = this.getConfig();
    config.selectedRepos = config.selectedRepos.filter(name => name !== repoName);
    config.featuredRepos = config.featuredRepos.filter(name => name !== repoName);
    this.updateConfig(config);
  }

  toggleFeaturedRepo(repoName) {
    const config = this.getConfig();
    if (config.featuredRepos.includes(repoName)) {
      config.featuredRepos = config.featuredRepos.filter(name => name !== repoName);
    } else {
      config.featuredRepos.push(repoName);
    }
    this.updateConfig(config);
  }

  toggleHiddenRepo(repoName) {
    const config = this.getConfig();
    if (config.hiddenRepos.includes(repoName)) {
      config.hiddenRepos = config.hiddenRepos.filter(name => name !== repoName);
    } else {
      config.hiddenRepos.push(repoName);
    }
    this.updateConfig(config);
  }

  getSelectedRepos() {
    const config = this.getConfig();
    return config ? config.selectedRepos : [];
  }

  getFeaturedRepos() {
    const config = this.getConfig();
    return config ? config.featuredRepos : [];
  }

  getHiddenRepos() {
    const config = this.getConfig();
    return config ? config.hiddenRepos : [];
  }

  shouldAutoSync() {
    const config = this.getConfig();
    if (!config || !config.autoSync) return false;
    
    if (!config.lastSync) return true;
    
    const timeSinceLastSync = Date.now() - config.lastSync;
    return timeSinceLastSync >= config.syncInterval;
  }

  markSyncComplete() {
    this.updateConfig({ lastSync: Date.now() });
  }

  addCustomProject(project) {
    const config = this.getConfig();
    const customProject = {
      ...project,
      id: `custom_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    
    config.customProjects.push(customProject);
    this.updateConfig(config);
    return customProject;
  }

  removeCustomProject(projectId) {
    const config = this.getConfig();
    config.customProjects = config.customProjects.filter(p => p.id !== projectId);
    this.updateConfig(config);
  }

  getCustomProjects() {
    const config = this.getConfig();
    return config ? config.customProjects : [];
  }

  updateDisplaySettings(settings) {
    const config = this.getConfig();
    config.displaySettings = { ...config.displaySettings, ...settings };
    this.updateConfig(config);
  }

  getDisplaySettings() {
    const config = this.getConfig();
    return config ? config.displaySettings : {};
  }

  toggleCategory(category) {
    const config = this.getConfig();
    config.categories[category] = !config.categories[category];
    this.updateConfig(config);
  }

  getEnabledCategories() {
    const config = this.getConfig();
    return config ? Object.keys(config.categories).filter(cat => config.categories[cat]) : [];
  }

  exportConfig() {
    const config = this.getConfig();
    return JSON.stringify(config, null, 2);
  }

  importConfig(configJson) {
    try {
      const config = JSON.parse(configJson);
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }

  resetConfig() {
    localStorage.removeItem(this.storageKey);
    return this.setDefaultConfig();
  }

  detectNewRepos(allRepos) {
    const config = this.getConfig();
    const configuredRepos = new Set([
      ...config.selectedRepos,
      ...config.hiddenRepos
    ]);

    return allRepos
      .filter(repo => !configuredRepos.has(repo.name))
      .filter(repo => !repo.archived && !repo.private)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  autoSelectRepositories(repos, criteria = {}) {
    const {
      minStars = 0,
      includeRecent = true,
      includeTopLanguages = ['JavaScript', 'TypeScript', 'Python'],
      maxRepos = 20
    } = criteria;

    let filtered = repos.filter(repo => 
      repo.stars >= minStars && 
      !repo.archived && 
      !repo.private
    );

    if (includeRecent) {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentRepos = filtered.filter(repo => 
        new Date(repo.updatedAt).getTime() > thirtyDaysAgo
      );
      
      const oldRepos = filtered.filter(repo => 
        new Date(repo.updatedAt).getTime() <= thirtyDaysAgo &&
        (repo.stars > 0 || includeTopLanguages.includes(repo.language))
      );

      filtered = [...recentRepos, ...oldRepos];
    }

    if (includeTopLanguages.length > 0) {
      const languageRepos = filtered.filter(repo => 
        includeTopLanguages.includes(repo.language)
      );
      const otherRepos = filtered.filter(repo => 
        !includeTopLanguages.includes(repo.language)
      );

      filtered = [...languageRepos, ...otherRepos];
    }

    return filtered
      .slice(0, maxRepos)
      .map(repo => repo.name);
  }
}

export default new PortfolioConfigService();