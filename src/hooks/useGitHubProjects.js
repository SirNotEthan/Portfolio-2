import { useState, useEffect, useCallback } from 'react';
import githubService from '../services/githubService';
import portfolioConfigService from '../services/portfolioConfigService';

export const useGitHubProjects = () => {
  const [projects, setProjects] = useState([]);
  const [allRepos, setAllRepos] = useState([]);
  const [newRepos, setNewRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [githubStats, setGithubStats] = useState(null);

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const selectedRepos = portfolioConfigService.getSelectedRepos();
      const featuredRepos = portfolioConfigService.getFeaturedRepos();
      const customProjects = portfolioConfigService.getCustomProjects();

      let githubProjects = [];
      if (selectedRepos.length > 0 || forceRefresh) {
        githubProjects = await githubService.getPortfolioProjects(selectedRepos);
        
        githubProjects = githubProjects.map(project => ({
          ...project,
          featured: featuredRepos.includes(project.name)
        }));
      }

      const allProjects = [...githubProjects, ...customProjects];
      
      const enabledCategories = portfolioConfigService.getEnabledCategories();
      const hiddenRepos = portfolioConfigService.getHiddenRepos();
      const filteredProjects = allProjects.filter(project => 
        enabledCategories.includes(project.category) && !hiddenRepos.includes(project.name)
      );

      setProjects(filteredProjects);
      portfolioConfigService.markSyncComplete();
      setLastSync(Date.now());

    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllRepos = useCallback(async () => {
    try {
      const repos = await githubService.getAllRepos();
      setAllRepos(repos);
      
      const newRepositories = portfolioConfigService.detectNewRepos(repos);
      setNewRepos(newRepositories);
      
      return repos;
    } catch (err) {
      console.error('Error fetching all repos:', err);
      return [];
    }
  }, []);

  const addRepository = useCallback(async (repoName) => {
    portfolioConfigService.addSelectedRepo(repoName);
    await fetchProjects();
  }, [fetchProjects]);

  const removeRepository = useCallback(async (repoName) => {
    portfolioConfigService.removeSelectedRepo(repoName);
    await fetchProjects();
  }, [fetchProjects]);

  const toggleFeatured = useCallback(async (repoName) => {
    portfolioConfigService.toggleFeaturedRepo(repoName);
    await fetchProjects();
  }, [fetchProjects]);

  const toggleHidden = useCallback(async (repoName) => {
    portfolioConfigService.toggleHiddenRepo(repoName);
    await fetchProjects();
  }, [fetchProjects]);

  const addCustomProject = useCallback(async (project) => {
    portfolioConfigService.addCustomProject(project);
    await fetchProjects();
  }, [fetchProjects]);

  const removeCustomProject = useCallback(async (projectId) => {
    portfolioConfigService.removeCustomProject(projectId);
    await fetchProjects();
  }, [fetchProjects]);

  const autoSelectRepos = useCallback(async (criteria) => {
    const repos = await fetchAllRepos();
    const selectedRepoNames = portfolioConfigService.autoSelectRepositories(repos, criteria);
    
    selectedRepoNames.forEach(repoName => {
      portfolioConfigService.addSelectedRepo(repoName);
    });

    await fetchProjects();
    return selectedRepoNames;
  }, [fetchAllRepos, fetchProjects]);

  const fetchGithubStats = useCallback(async () => {
    try {
      const stats = await githubService.getUserStats();
      setGithubStats(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching GitHub stats:', err);
      return null;
    }
  }, []);

  const syncProjects = useCallback(async () => {
    await fetchProjects(true);
    await fetchAllRepos();
    await fetchGithubStats();
  }, [fetchProjects, fetchAllRepos, fetchGithubStats]);

  useEffect(() => {
    const performInitialSync = async () => {
      if (portfolioConfigService.shouldAutoSync()) {
        await syncProjects();
      } else {
        await fetchProjects();
        await fetchAllRepos();
        await fetchGithubStats();
      }
    };

    performInitialSync();
  }, [fetchProjects, fetchAllRepos, fetchGithubStats, syncProjects]);

  useEffect(() => {
    const config = portfolioConfigService.getConfig();
    if (config?.autoSync) {
      const interval = setInterval(() => {
        if (portfolioConfigService.shouldAutoSync()) {
          syncProjects();
        }
      }, config.syncInterval);

      return () => clearInterval(interval);
    }
  }, [syncProjects]);

  const getProjectsByCategory = useCallback((category) => {
    return projects.filter(project => project.category === category);
  }, [projects]);

  const getFeaturedProjects = useCallback(() => {
    return projects.filter(project => project.featured);
  }, [projects]);

  const getProjectStats = useCallback(() => {
    const stats = {
      total: projects.length,
      byCategory: {},
      byStatus: {},
      totalStars: 0,
      totalForks: 0,
      languages: new Set(),
      featured: 0
    };

    projects.forEach(project => {
      stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
      
      stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
      
      if (!project.isCustom) {
        stats.totalStars += project.stars || 0;
        stats.totalForks += project.forks || 0;
      }
      
      if (project.technologies) {
        project.technologies.forEach(tech => stats.languages.add(tech));
      }
      
      if (project.featured) stats.featured++;
    });

    stats.languages = Array.from(stats.languages);
    return stats;
  }, [projects]);

  return {
    projects,
    allRepos,
    newRepos,
    loading,
    error,
    lastSync,
    githubStats,
    
    fetchProjects,
    fetchAllRepos,
    fetchGithubStats,
    addRepository,
    removeRepository,
    toggleFeatured,
    toggleHidden,
    addCustomProject,
    removeCustomProject,
    autoSelectRepos,
    syncProjects,
    
    getProjectsByCategory,
    getFeaturedProjects,
    getProjectStats,
    
    selectedRepos: portfolioConfigService.getSelectedRepos(),
    featuredRepos: portfolioConfigService.getFeaturedRepos(),
    hiddenRepos: portfolioConfigService.getHiddenRepos(),
    customProjects: portfolioConfigService.getCustomProjects(),
    enabledCategories: portfolioConfigService.getEnabledCategories()
  };
};