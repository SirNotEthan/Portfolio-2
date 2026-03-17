import { useState, useEffect } from 'react';

const GITHUB_USERNAME = 'SirNotEthan';
const GITHUB_API = 'https://api.github.com';

export function useGitHubStats() {
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`),
          fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');

        const user = await userRes.json();
        const repos = await reposRes.json();

        const publicRepos = repos.filter(r => !r.private);
        const totalStars = publicRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        const totalForks = publicRepos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
        const languages = [...new Set(publicRepos.map(r => r.language).filter(Boolean))];

        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const ninetyDays = 90 * 24 * 60 * 60 * 1000;

        const recentActivity = {
          recentlyUpdated: publicRepos.filter(r => Date.now() - new Date(r.updated_at).getTime() < thirtyDays).length,
          activeRepos: publicRepos.filter(r => now - new Date(r.updated_at).getTime() < ninetyDays).length,
          totalRepos: publicRepos.length,
        };

        if (!cancelled) {
          setGithubStats({
            publicRepos: user.public_repos,
            followers: user.followers,
            totalStars,
            totalForks,
            languages,
            recentActivity,
          });
        }
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { githubStats, loading };
}
