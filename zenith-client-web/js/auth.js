// authentication and token management

const auth = {
  // save token to local storage
  setToken(token) {
    localStorage.setItem(config.tokenKey, token);
  },
  
  // get token from local storage
  getToken() {
    return localStorage.getItem(config.tokenKey);
  },
  
  // remove token
  clearToken() {
    localStorage.removeItem(config.tokenKey);
  },
  
  // save user data
  setUser(user) {
    localStorage.setItem(config.userKey, JSON.stringify(user));
  },
  
  // get user data
  getUser() {
    const userData = localStorage.getItem(config.userKey);
    return userData ? JSON.parse(userData) : null;
  },
  
  // remove user data
  clearUser() {
    localStorage.removeItem(config.userKey);
  },
  
  // check if user is logged in
  isLoggedIn() {
    return this.getToken() !== null;
  },
  
  // get auth headers for api requests
  getAuthHeaders() {
    const token = this.getToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  },
  
  // logout user
  logout() {
    this.clearToken();
    this.clearUser();
    window.location.href = 'auth.html';
  },
  
  // redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  },
  
  // get user's account type
  getAccountType() {
    const user = this.getUser();
    return user?.accountType || 'PERSONAL';
  },
  
  // check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  },
  
  // get user's full name
  getUserName() {
    const user = this.getUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || 'User';
  }
};
