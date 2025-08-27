class AuthService {
  constructor() {
    this.sessionTimeout = 4 * 60 * 60 * 1000;
  }

  isAuthenticated() {
    const authStatus = sessionStorage.getItem('portfolio_admin_auth');
    const authTime = sessionStorage.getItem('portfolio_admin_auth_time');

    if (!authStatus || !authTime) {
      return false;
    }

    const currentTime = Date.now();
    const sessionTime = parseInt(authTime);
    
    if (currentTime - sessionTime > this.sessionTimeout) {
      this.logout();
      return false;
    }

    sessionStorage.setItem('portfolio_admin_auth_time', currentTime.toString());
    
    return authStatus === 'true';
  }

  logout() {
    sessionStorage.removeItem('portfolio_admin_auth');
    sessionStorage.removeItem('portfolio_admin_auth_time');
    
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('portfolio_admin_')) {
        sessionStorage.removeItem(key);
      }
    });
  }

  getRemainingSessionTime() {
    const authTime = sessionStorage.getItem('portfolio_admin_auth_time');
    if (!authTime) return 0;

    const currentTime = Date.now();
    const sessionTime = parseInt(authTime);
    const elapsed = currentTime - sessionTime;
    const remaining = this.sessionTimeout - elapsed;

    return Math.max(0, remaining);
  }

  formatRemainingTime() {
    const remaining = this.getRemainingSessionTime();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Expired';
    }
  }

  extendSession() {
    if (this.isAuthenticated()) {
      sessionStorage.setItem('portfolio_admin_auth_time', Date.now().toString());
      return true;
    }
    return false;
  }

  logAccessAttempt(success, userAgent = null, ip = null) {
    const attempt = {
      timestamp: new Date().toISOString(),
      success,
      userAgent: userAgent || navigator.userAgent,
      ip: ip || 'unknown',
      sessionId: this.generateSessionId()
    };

    const attempts = JSON.parse(sessionStorage.getItem('portfolio_access_attempts') || '[]');
    attempts.push(attempt);
    
    const recentAttempts = attempts.slice(-10);
    sessionStorage.setItem('portfolio_access_attempts', JSON.stringify(recentAttempts));

    return attempt;
  }

  getAccessAttempts() {
    return JSON.parse(sessionStorage.getItem('portfolio_access_attempts') || '[]');
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  isSuspiciousActivity() {
    const attempts = this.getAccessAttempts();
    const recentFailures = attempts
      .filter(attempt => !attempt.success)
      .filter(attempt => {
        const attemptTime = new Date(attempt.timestamp).getTime();
        const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
        return attemptTime > fifteenMinutesAgo;
      });

    return recentFailures.length >= 3;
  }

  getLockoutTimeRemaining() {
    const attempts = this.getAccessAttempts();
    const lastFailedAttempt = attempts
      .filter(attempt => !attempt.success)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    if (!lastFailedAttempt) return 0;

    const lockoutDuration = 15 * 60 * 1000;
    const lastAttemptTime = new Date(lastFailedAttempt.timestamp).getTime();
    const lockoutEnd = lastAttemptTime + lockoutDuration;
    const remaining = lockoutEnd - Date.now();

    return Math.max(0, remaining);
  }
}

export default new AuthService();