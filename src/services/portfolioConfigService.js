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
    let featuredRepos = config ? config.featuredRepos : [];
    
    // Check for compressed URL config first
    const urlConfig = this.parseUrlConfig();
    if (urlConfig && urlConfig.featuredRepos.length > 0) {
      return urlConfig.featuredRepos;
    }
    
    // Fallback to legacy URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const featuredParam = urlParams.get('featured');
    
    if (featuredParam) {
      const urlFeatured = featuredParam.split(',');
      featuredRepos = [...new Set([...featuredRepos, ...urlFeatured])];
    }
    
    return featuredRepos;
  }

  getHiddenRepos() {
    const config = this.getConfig();
    let hiddenRepos = config ? config.hiddenRepos : [];
    
    // Check for compressed URL config first
    const urlConfig = this.parseUrlConfig();
    if (urlConfig && urlConfig.hiddenRepos.length > 0) {
      return urlConfig.hiddenRepos;
    }
    
    // Fallback to legacy URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const showParam = urlParams.get('show');
    const hideParam = urlParams.get('hide');
    
    if (showParam) {
      const showRepos = showParam.split(',');
      hiddenRepos = hiddenRepos.filter(repo => !showRepos.includes(repo));
    }
    
    if (hideParam) {
      const hideRepos = hideParam.split(',');
      hiddenRepos = [...new Set([...hiddenRepos, ...hideRepos])];
    }
    
    return hiddenRepos;
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
    let enabledCategories = config ? Object.keys(config.categories).filter(cat => config.categories[cat]) : [];
    
    // Check for compressed URL config override
    const urlConfig = this.parseUrlConfig();
    if (urlConfig && urlConfig.enabledCategories.length > 0) {
      return urlConfig.enabledCategories;
    }
    
    return enabledCategories;
  }

  exportConfig() {
    const config = this.getConfig();
    return JSON.stringify(config, null, 2);
  }

  generateSyncUrl(baseUrl = window.location.origin) {
    const config = this.getConfig();
    if (!config) return baseUrl;

    // Create compressed config object
    const compressedConfig = {
      h: config.hiddenRepos || [],
      f: config.featuredRepos || [],
      c: Object.keys(config.categories || {}).filter(cat => config.categories[cat])
    };

    // Remove empty arrays to save space
    Object.keys(compressedConfig).forEach(key => {
      if (Array.isArray(compressedConfig[key]) && compressedConfig[key].length === 0) {
        delete compressedConfig[key];
      }
    });

    if (Object.keys(compressedConfig).length === 0) {
      return baseUrl;
    }

    // Check for common presets first
    const preset = this.getPresetForConfig(compressedConfig);
    if (preset) {
      return `${baseUrl}?preset=${preset}`;
    }

    // Compress and encode
    const configString = JSON.stringify(compressedConfig);
    const base64Config = btoa(configString).replace(/[+/=]/g, (m) => ({'+': '-', '/': '_', '=': ''}[m]));
    
    return `${baseUrl}?config=${base64Config}`;
  }

  getPresetForConfig(compressedConfig) {
    const presets = {
      'all': { c: ['Web Development', 'Game Development', '3D Modeling', 'Mobile Development'] },
      'web': { c: ['Web Development'] },
      'games': { c: ['Game Development'] },
      'mobile': { c: ['Mobile Development'] },
      '3d': { c: ['3D Modeling'] },
      'featured': { f: compressedConfig.f, c: compressedConfig.c },
    };

    const configStr = JSON.stringify(compressedConfig);
    for (const [preset, presetConfig] of Object.entries(presets)) {
      if (preset === 'featured') continue; // Skip dynamic preset
      if (JSON.stringify(presetConfig) === configStr) {
        return preset;
      }
    }

    // Check if it's just featured repos with all categories
    if (compressedConfig.f && compressedConfig.f.length > 0 && 
        JSON.stringify(compressedConfig.c) === JSON.stringify(presets.all.c) &&
        !compressedConfig.h) {
      return `f-${this.hashArray(compressedConfig.f)}`;
    }

    return null;
  }

  hashArray(arr) {
    return arr.sort().join(',').split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0).toString(36).substring(0, 6);
  }

  parseUrlConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    const presetParam = urlParams.get('preset');
    
    // Handle preset shortcuts
    if (presetParam) {
      return this.expandPreset(presetParam);
    }
    
    // Handle compressed config
    if (configParam) {
      try {
        // Decode compressed config
        const base64 = configParam.replace(/[-_]/g, (m) => ({'-': '+', '_': '/'}[m]));
        const paddedBase64 = base64 + '='.repeat(4 - base64.length % 4);
        const configString = atob(paddedBase64);
        const compressed = JSON.parse(configString);
        
        return {
          hiddenRepos: compressed.h || [],
          featuredRepos: compressed.f || [],
          enabledCategories: compressed.c || []
        };
      } catch (error) {
        console.warn('Failed to parse URL config:', error);
        return null;
      }
    }
    
    return null;
  }

  expandPreset(preset) {
    const presets = {
      'all': { c: ['Web Development', 'Game Development', '3D Modeling', 'Mobile Development'] },
      'web': { c: ['Web Development'] },
      'games': { c: ['Game Development'] },
      'mobile': { c: ['Mobile Development'] },
      '3d': { c: ['3D Modeling'] }
    };

    if (presets[preset]) {
      return {
        hiddenRepos: [],
        featuredRepos: [],
        enabledCategories: presets[preset].c
      };
    }

    // Handle featured repo hash (f-abc123)
    if (preset.startsWith('f-')) {
      // This would need the actual repo list to reverse the hash
      // For now, return all categories with empty featured list
      return {
        hiddenRepos: [],
        featuredRepos: [],
        enabledCategories: presets.all.c
      };
    }

    return null;
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