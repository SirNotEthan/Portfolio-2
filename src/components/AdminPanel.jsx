import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, FaStar, FaEye, FaEyeSlash, FaCog, FaSync, FaPlus, 
  FaTrash, FaDownload, FaUpload, FaCheck, FaTimes, FaFilter,
  FaCode, FaGamepad, FaCube, FaMobile, FaRocket, FaExclamationTriangle,
  FaSignOutAlt, FaClock
} from 'react-icons/fa';
import { useGitHubProjects } from '../hooks/useGitHubProjects';
import portfolioConfigService from '../services/portfolioConfigService';
import authService from '../services/authService';

function AdminPanel({ isOpen, onClose }) {
  const {
    projects,
    allRepos,
    newRepos,
    loading,
    error,
    lastSync,
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
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card-gradient rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCog className="text-blue-400 text-2xl" />
              <h2 className="text-2xl font-bold text-white">Portfolio Admin</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaClock />
                <span>Session: {sessionTime}</span>
              </div>
              <button
                onClick={syncProjects}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                Sync
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                title="Logout"
              >
                <FaSignOutAlt />
                Logout
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.featured}</div>
              <div className="text-sm text-gray-400">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.totalStars}</div>
              <div className="text-sm text-gray-400">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{selectedRepos.length}</div>
              <div className="text-sm text-gray-400">Selected Repos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{newRepos.length}</div>
              <div className="text-sm text-gray-400">New Repos</div>
            </div>
          </div>
        </div>

        {/* New Repos Alert */}
        {showNewReposAlert && newRepos.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 m-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-yellow-400" />
                <span className="text-white">
                  {newRepos.length} new repositories detected!
                </span>
              </div>
              <button
                onClick={() => setShowNewReposAlert(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            {[
              { id: 'repos', label: 'Repositories', icon: FaGithub },
              { id: 'settings', label: 'Settings', icon: FaCog }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'repos' && (
            <div className="h-full flex flex-col">
              {/* Controls */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex flex-wrap gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 flex-1 min-w-[200px]"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    <FaRocket />
                    Auto Select
                  </button>
                </div>
              </div>

              {/* Repository List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-400">Loading repositories...</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRepos.map(repo => {
                      const isSelected = selectedRepos.includes(repo.name);
                      const isFeatured = featuredRepos.includes(repo.name);
                      const isHidden = hiddenRepos.includes(repo.name);
                      const isNew = newRepos.some(newRepo => newRepo.name === repo.name);

                      return (
                        <motion.div
                          key={repo.name}
                          className={`bg-black/30 rounded-lg p-4 border transition-all ${
                            isSelected ? 'border-blue-400 bg-blue-500/10' :
                            isHidden ? 'border-red-400 bg-red-500/10 opacity-50' :
                            'border-gray-600 hover:border-gray-500'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-white font-semibold">{repo.name}</h3>
                                {isNew && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                    NEW
                                  </span>
                                )}
                                {isFeatured && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                                    <FaStar className="text-xs" /> Featured
                                  </span>
                                )}
                                {repo.archived && (
                                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                    Archived
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm mb-2">
                                {repo.description || 'No description'}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                {repo.language && (
                                  <span className="flex items-center gap-1">
                                    <FaCode /> {repo.language}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <FaStar /> {repo.stars}
                                </span>
                                <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => isSelected ? removeRepository(repo.name) : addRepository(repo.name)}
                                className={`p-2 rounded-lg transition-all ${
                                  isSelected 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                                title={isSelected ? 'Remove from portfolio' : 'Add to portfolio'}
                              >
                                {isSelected ? <FaTimes /> : <FaPlus />}
                              </button>
                              {isSelected && (
                                <button
                                  onClick={() => toggleFeatured(repo.name)}
                                  className={`p-2 rounded-lg transition-all ${
                                    isFeatured 
                                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                                  }`}
                                  title={isFeatured ? 'Remove from featured' : 'Mark as featured'}
                                >
                                  <FaStar />
                                </button>
                              )}
                              <button
                                onClick={() => toggleHidden(repo.name)}
                                className={`p-2 rounded-lg transition-all ${
                                  isHidden 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                                }`}
                                title={isHidden ? 'Show repository' : 'Hide repository'}
                              >
                                {isHidden ? <FaEye /> : <FaEyeSlash />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Export/Import */}
                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-4">Configuration</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={handleExportConfig}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      <FaDownload />
                      Export Config
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all cursor-pointer">
                      <FaUpload />
                      Import Config
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportConfig}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all configuration?')) {
                          portfolioConfigService.resetConfig();
                          syncProjects();
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                    >
                      <FaTrash />
                      Reset Config
                    </button>
                  </div>
                </div>

                {/* Last Sync */}
                {lastSync && (
                  <div className="bg-black/30 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Sync Status</h3>
                    <p className="text-gray-400">
                      Last synced: {new Date(lastSync).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-red-400 font-semibold mb-2">Error</h3>
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminPanel;