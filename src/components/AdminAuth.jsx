import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash, FaTimes, FaShieldAlt } from 'react-icons/fa';
import authService from '../services/authService';

function AdminAuth({ isOpen, onClose, onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (isOpen) {
      const lockoutTime = authService.getLockoutTimeRemaining();
      if (lockoutTime > 0) {
        setIsLockedOut(true);
        setLockoutTimeRemaining(lockoutTime);
        
        const interval = setInterval(() => {
          const remaining = authService.getLockoutTimeRemaining();
          setLockoutTimeRemaining(remaining);
          
          if (remaining <= 0) {
            setIsLockedOut(false);
            clearInterval(interval);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLockedOut) {
      setError('Too many failed attempts. Please wait before trying again.');
      return;
    }

    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 500));

    const success = password === ADMIN_PASSWORD;
    
    authService.logAccessAttempt(success);

    if (success) {
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      sessionStorage.setItem('portfolio_admin_auth_time', Date.now().toString());
      onAuthenticated();
      setPassword('');
    } else {
      setError('Invalid password. Access denied.');
      setPassword('');
      
      if (authService.isSuspiciousActivity()) {
        setIsLockedOut(true);
        const lockoutTime = 15 * 60 * 1000;
        setLockoutTimeRemaining(lockoutTime);
        setError('Too many failed attempts. Account temporarily locked for 15 minutes.');
        
        const interval = setInterval(() => {
          const remaining = authService.getLockoutTimeRemaining();
          setLockoutTimeRemaining(remaining);
          
          if (remaining <= 0) {
            setIsLockedOut(false);
            setError('');
            clearInterval(interval);
          }
        }, 1000);
      }
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const formatLockoutTime = (ms) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        className="bg-card-gradient rounded-xl w-full max-w-md overflow-hidden border border-gray-700"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-red-600/20 border-b border-red-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaLock className="text-red-400 text-2xl" />
              <h2 className="text-2xl font-bold text-white">Admin Access</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-gray-300 mt-2">
            This area is restricted. Please enter the admin password to continue.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-gray-300 font-semibold mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 bg-black/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {isLockedOut && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-orange-400">
                  <FaShieldAlt />
                  <span className="text-sm font-medium">
                    Account Locked - {formatLockoutTime(lockoutTimeRemaining)} remaining
                  </span>
                </div>
                <p className="text-orange-300 text-xs mt-1">
                  Multiple failed attempts detected. Please wait before trying again.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || !password || isLockedOut}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : isLockedOut ? (
                  'Account Locked'
                ) : (
                  'Access Admin Panel'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-xs">
              <strong>Security Notice:</strong> Access is logged and monitored. Unauthorized access attempts are tracked.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminAuth;