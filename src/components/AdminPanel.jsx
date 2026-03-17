import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

import {
  FaGithub, FaStar, FaEye, FaEyeSlash, FaCog, FaSync, FaPlus,
  FaTrash, FaDownload, FaUpload, FaTimes,
  FaCode, FaRocket, FaExclamationTriangle,
  FaSignOutAlt, FaClock, FaChartLine,
  FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaGlobe
} from 'react-icons/fa';
import { useGitHubProjects } from '../hooks/useGitHubProjects';
import portfolioConfigService from '../services/portfolioConfigService';
import authService from '../services/authService';

function AdminPanel({ isOpen, onClose }) {
  const {
    allRepos,
    newRepos,
    loading,
    error,
    lastSync,
    githubStats,
    addRepository,
    removeRepository,
    toggleFeatured,
    toggleHidden,
    syncProjects,
    autoSelectRepos,
    selectedRepos,
    featuredRepos,
    hiddenRepos,
    getProjectStats
  } = useGitHubProjects();

  const [activeTab, setActiveTab] = useState('repos');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showNewReposAlert, setShowNewReposAlert] = useState(false);
  const [sessionTime, setSessionTime] = useState('');

  const stats = getProjectStats();

  useEffect(() => {
    if (newRepos.length > 0) {
      setShowNewReposAlert(true);
    }
  }, [newRepos]);

  useEffect(() => {
    const updateSessionTime = () => {
      setSessionTime(authService.formatRemainingTime());
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      authService.logout();
      onClose();
      window.location.reload();
    }
  };

  const filteredRepos = allRepos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' ||
                           (repo.language && repo.language.includes(categoryFilter));
    return matchesSearch && matchesCategory;
  });

  const handleAutoSelect = async () => {
    const criteria = {
      minStars: 0,
      includeRecent: true,
      includeTopLanguages: ['JavaScript', 'TypeScript', 'Python', 'Lua'],
      maxRepos: 15
    };

    await autoSelectRepos(criteria);
  };

  const handleExportConfig = () => {
    const config = portfolioConfigService.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateSyncUrl = () => {
    const syncUrl = portfolioConfigService.generateSyncUrl();
    navigator.clipboard.writeText(syncUrl).then(() => {
      alert('Sync URL copied to clipboard!');
    }).catch(() => {
      prompt('Copy this URL:', syncUrl);
    });
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = portfolioConfigService.importConfig(e.target.result);
        if (success) {
          syncProjects();
        } else {
          alert('Failed to import configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MotionDiv
        className="w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col rounded-sm"
        style={{ background: 'var(--terminal-bg)', border: '1px solid var(--terminal-border)' }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--terminal-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: 'var(--terminal-amber)' }}>$</span>
              <span style={{ color: 'var(--terminal-fg)' }} className="font-bold">admin-panel</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--terminal-comment)' }}>
                <FaClock />
                <span>Session: {sessionTime}</span>
              </div>
              <button
                onClick={syncProjects}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-sm transition-all disabled:opacity-50 cursor-pointer"
                style={{ background: 'var(--terminal-amber)', color: '#000' }}
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                sync
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-sm transition-all cursor-pointer"
                style={{ background: 'var(--terminal-red)', color: '#fff' }}
              >
                <FaSignOutAlt />
                logout
              </button>
              <button
                onClick={onClose}
                className="text-lg transition-colors cursor-pointer hover:opacity-80"
                style={{ color: 'var(--terminal-comment)' }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-3 text-center text-xs">
            <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-amber)' }}>{stats.total}</div><div style={{ color: 'var(--terminal-comment)' }}>Projects</div></div>
            <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-yellow)' }}>{stats.featured}</div><div style={{ color: 'var(--terminal-comment)' }}>Featured</div></div>
            <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-green)' }}>{githubStats?.totalStars || stats.totalStars || 0}</div><div style={{ color: 'var(--terminal-comment)' }}>Stars</div></div>
            <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-purple)' }}>{githubStats?.totalForks || stats.totalForks || 0}</div><div style={{ color: 'var(--terminal-comment)' }}>Forks</div></div>
            <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-cyan)' }}>{allRepos.length}</div><div style={{ color: 'var(--terminal-comment)' }}>All Repos</div></div>
            <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-red)' }}>{newRepos.length}</div><div style={{ color: 'var(--terminal-comment)' }}>New</div></div>
          </div>
        </div>

        {/* New Repos Alert */}
        {showNewReposAlert && newRepos.length > 0 && (
          <div className="p-3 m-3 rounded-sm" style={{ background: 'rgba(255, 176, 0, 0.1)', border: '1px solid rgba(255, 176, 0, 0.3)' }}>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FaExclamationTriangle style={{ color: 'var(--terminal-amber)' }} />
                <span style={{ color: 'var(--terminal-fg)' }}>{newRepos.length} new repositories detected</span>
              </div>
              <button onClick={() => setShowNewReposAlert(false)} className="cursor-pointer" style={{ color: 'var(--terminal-comment)' }}><FaTimes /></button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex-shrink-0" style={{ borderBottom: '1px solid var(--terminal-border)' }}>
          <div className="flex">
            {[
              { id: 'repos', label: 'repos', icon: FaGithub },
              { id: 'stats', label: 'stats', icon: FaChartLine },
              { id: 'settings', label: 'settings', icon: FaCog }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
                style={{
                  color: activeTab === tab.id ? 'var(--terminal-amber)' : 'var(--terminal-comment)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--terminal-amber)' : '2px solid transparent'
                }}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {activeTab === 'repos' && (
            <div className="h-full flex flex-col">
              {/* Controls */}
              <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--terminal-border)' }}>
                <div className="flex flex-wrap gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1.5 terminal-input rounded-sm flex-1 min-w-[200px] text-sm"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 terminal-input rounded-sm text-sm"
                  >
                    <option value="All">All Languages</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Lua">Lua</option>
                    <option value="CSS">CSS</option>
                  </select>
                  <button
                    onClick={handleAutoSelect}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm transition-all cursor-pointer"
                    style={{ background: 'var(--terminal-green)', color: '#000' }}
                  >
                    <FaRocket /> auto-select
                  </button>
                </div>
              </div>

              {/* Repository List */}
              <div className="flex-1 overflow-y-auto p-3 min-h-0" style={{maxHeight: 'calc(90vh - 300px)'}}>
                {loading ? (
                  <div className="flex items-center justify-center h-32" style={{ color: 'var(--terminal-comment)' }}>
                    Loading repositories...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredRepos.map(repo => {
                      const isSelected = selectedRepos.includes(repo.name);
                      const isFeatured = featuredRepos.includes(repo.name);
                      const isHidden = hiddenRepos.includes(repo.name);
                      const isNew = newRepos.some(newRepo => newRepo.name === repo.name);

                      return (
                        <div
                          key={repo.name}
                          className="p-3 rounded-sm transition-all text-sm"
                          style={{
                            background: isSelected ? 'rgba(255, 176, 0, 0.05)' : 'var(--terminal-surface)',
                            border: `1px solid ${isSelected ? 'var(--terminal-amber)' : isHidden ? 'var(--terminal-red)' : 'var(--terminal-border)'}`,
                            opacity: isHidden ? 0.5 : 1
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span style={{ color: 'var(--terminal-fg)' }} className="font-bold">{repo.name}</span>
                                {isNew && (
                                  <span className="px-1.5 py-0.5 text-xs rounded-sm" style={{ background: 'rgba(255, 176, 0, 0.2)', color: 'var(--terminal-amber)' }}>NEW</span>
                                )}
                                {isFeatured && (
                                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-sm" style={{ background: 'rgba(241, 250, 140, 0.2)', color: 'var(--terminal-yellow)' }}>
                                    <FaStar className="text-xs" /> featured
                                  </span>
                                )}
                                {repo.archived && (
                                  <span className="px-1.5 py-0.5 text-xs rounded-sm" style={{ background: 'rgba(98, 114, 164, 0.2)', color: 'var(--terminal-comment)' }}>archived</span>
                                )}
                              </div>
                              <p className="text-xs mb-1" style={{ color: 'var(--terminal-comment)' }}>
                                {repo.description || 'No description'}
                              </p>
                              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--terminal-comment)' }}>
                                {repo.language && (
                                  <span className="flex items-center gap-1">
                                    <FaCode style={{ color: 'var(--terminal-purple)' }} /> {repo.language}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <FaStar style={{ color: 'var(--terminal-yellow)' }} /> {repo.stars}
                                </span>
                                <span>{new Date(repo.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-3">
                              <button
                                onClick={() => isSelected ? removeRepository(repo.name) : addRepository(repo.name)}
                                className="p-1.5 rounded-sm transition-all cursor-pointer"
                                style={{
                                  background: isSelected ? 'var(--terminal-red)' : 'var(--terminal-amber)',
                                  color: isSelected ? '#fff' : '#000'
                                }}
                                title={isSelected ? 'Remove' : 'Add'}
                              >
                                {isSelected ? <FaTimes /> : <FaPlus />}
                              </button>
                              {isSelected && (
                                <button
                                  onClick={() => toggleFeatured(repo.name)}
                                  className="p-1.5 rounded-sm transition-all cursor-pointer"
                                  style={{
                                    background: isFeatured ? 'var(--terminal-yellow)' : 'var(--terminal-surface)',
                                    color: isFeatured ? '#000' : 'var(--terminal-comment)',
                                    border: `1px solid ${isFeatured ? 'var(--terminal-yellow)' : 'var(--terminal-border)'}`
                                  }}
                                  title={isFeatured ? 'Unfeature' : 'Feature'}
                                >
                                  <FaStar />
                                </button>
                              )}
                              <button
                                onClick={() => toggleHidden(repo.name)}
                                className="p-1.5 rounded-sm transition-all cursor-pointer"
                                style={{
                                  background: isHidden ? 'var(--terminal-green)' : 'var(--terminal-surface)',
                                  color: isHidden ? '#000' : 'var(--terminal-comment)',
                                  border: `1px solid ${isHidden ? 'var(--terminal-green)' : 'var(--terminal-border)'}`
                                }}
                                title={isHidden ? 'Show' : 'Hide'}
                              >
                                {isHidden ? <FaEye /> : <FaEyeSlash />}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-4">
                {githubStats ? (
                  <>
                    {/* Profile */}
                    <div className="p-4 rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                      <div className="flex items-center gap-4 mb-4">
                        <img src={githubStats.avatarUrl} alt={githubStats.name || githubStats.username} className="w-12 h-12 rounded-sm" />
                        <div>
                          <div className="font-bold" style={{ color: 'var(--terminal-fg)' }}>{githubStats.name || githubStats.username}</div>
                          <div className="text-xs" style={{ color: 'var(--terminal-comment)' }}>@{githubStats.username}</div>
                          {githubStats.bio && <div className="text-xs mt-1" style={{ color: 'var(--terminal-fg)' }}>{githubStats.bio}</div>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-center text-xs">
                        <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-amber)' }}>{githubStats.publicRepos}</div><div style={{ color: 'var(--terminal-comment)' }}>Repos</div></div>
                        <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-green)' }}>{githubStats.followers}</div><div style={{ color: 'var(--terminal-comment)' }}>Followers</div></div>
                        <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-purple)' }}>{githubStats.following}</div><div style={{ color: 'var(--terminal-comment)' }}>Following</div></div>
                        <div><div className="text-lg font-bold" style={{ color: 'var(--terminal-yellow)' }}>{githubStats.publicGists}</div><div style={{ color: 'var(--terminal-comment)' }}>Gists</div></div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--terminal-comment)' }}>
                        {githubStats.company && <div className="flex items-center gap-1"><FaBriefcase /> {githubStats.company}</div>}
                        {githubStats.location && <div className="flex items-center gap-1"><FaMapMarkerAlt /> {githubStats.location}</div>}
                        {githubStats.blog && (
                          <a href={githubStats.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80" style={{ color: 'var(--terminal-cyan)' }}>
                            <FaGlobe /> {githubStats.blog}
                          </a>
                        )}
                        <div className="flex items-center gap-1"><FaCalendarAlt /> Joined {new Date(githubStats.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--terminal-amber)' }}>
                          <FaStar /> Repository Overview
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Total Stars:</span><span style={{ color: 'var(--terminal-yellow)' }}>{githubStats.totalStars}</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Total Forks:</span><span style={{ color: 'var(--terminal-green)' }}>{githubStats.totalForks}</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Total Size:</span><span style={{ color: 'var(--terminal-purple)' }}>{Math.round(githubStats.totalSize / 1024)} MB</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Languages:</span><span style={{ color: 'var(--terminal-cyan)' }}>{githubStats.languages.length}</span></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--terminal-green)' }}>
                          <FaChartLine /> Recent Activity
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Updated (30d):</span><span style={{ color: 'var(--terminal-green)' }}>{githubStats.recentActivity.recentlyUpdated}</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Active (90d):</span><span style={{ color: 'var(--terminal-amber)' }}>{githubStats.recentActivity.activeRepos}</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--terminal-comment)' }}>Rate:</span><span style={{ color: 'var(--terminal-purple)' }}>{Math.round((githubStats.recentActivity.activeRepos / githubStats.recentActivity.totalRepos) * 100)}%</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="p-4 rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                      <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--terminal-cyan)' }}>
                        <FaCode /> Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {githubStats.languages.map(language => (
                          <span key={language} className="px-2 py-0.5 text-xs rounded-sm" style={{ background: 'rgba(255, 176, 0, 0.1)', color: 'var(--terminal-amber)', border: '1px solid rgba(255, 176, 0, 0.2)' }}>
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                    <FaChartLine className="text-3xl mb-3 mx-auto" style={{ color: 'var(--terminal-comment)' }} />
                    <div style={{ color: 'var(--terminal-fg)' }}>Loading GitHub Stats...</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="p-4 rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--terminal-fg)' }}>Configuration</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={handleExportConfig} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm cursor-pointer transition-all hover:opacity-80" style={{ background: 'var(--terminal-amber)', color: '#000' }}>
                      <FaDownload /> export
                    </button>
                    <label className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm cursor-pointer transition-all hover:opacity-80" style={{ background: 'var(--terminal-green)', color: '#000' }}>
                      <FaUpload /> import
                      <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
                    </label>
                    <button onClick={handleGenerateSyncUrl} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm cursor-pointer transition-all hover:opacity-80" style={{ background: 'var(--terminal-purple)', color: '#fff' }}>
                      <FaGlobe /> sync-url
                    </button>
                    <button onClick={() => { if (confirm('Reset all configuration?')) { portfolioConfigService.resetConfig(); syncProjects(); } }} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm cursor-pointer transition-all hover:opacity-80" style={{ background: 'var(--terminal-red)', color: '#fff' }}>
                      <FaTrash /> reset
                    </button>
                  </div>
                </div>

                {lastSync && (
                  <div className="p-4 rounded-sm" style={{ background: 'var(--terminal-surface)', border: '1px solid var(--terminal-border)' }}>
                    <div className="text-sm" style={{ color: 'var(--terminal-comment)' }}>
                      Last synced: {new Date(lastSync).toLocaleString()}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-sm" style={{ background: 'rgba(255, 85, 85, 0.1)', border: '1px solid rgba(255, 85, 85, 0.3)' }}>
                    <div className="text-sm" style={{ color: 'var(--terminal-red)' }}>Error: {error}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}

export default AdminPanel;
