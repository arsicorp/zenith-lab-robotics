// auth page - login and register forms

const authPage = {
  // initialize auth page
  init() {
    // if already logged in, redirect to home
    if (auth.isLoggedIn()) {
      const redirect = utils.getQueryParam('redirect') || 'index.html';
      window.location.href = redirect;
      return;
    }
    
    this.setupTabs();
    this.setupForms();
  },
  
  // setup tab switching
  setupTabs() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');
    
    if (!loginTab || !registerTab || !loginForm || !registerForm) return;
    
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    });
    
    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    });
  },
  
  // setup form handlers
  setupForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
    
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }
  },
  
  // handle login
  async handleLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    utils.clearMessages();
    
    const username = form.username.value.trim();
    const password = form.password.value;
    
    if (!username || !password) {
      utils.showError('Please enter username and password');
      return;
    }
    
    try {
      // disable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Logging in...';
      }
      
      // login
      const response = await api.login(username, password);
      
      // save token and user
      auth.setToken(response.token);
      auth.setUser(response.user);
      
      // redirect
      const redirect = utils.getQueryParam('redirect') || 'index.html';
      window.location.href = redirect;
      
    } catch (error) {
      // re-enable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Login';
      }
      
      utils.showError(error.message || 'Login failed');
    }
  },
  
  // handle register
  async handleRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    utils.clearMessages();
    
    // get form data
    const username = form.username.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone?.value.trim() || '';
    
    // validate
    if (!username || !password || !firstName || !lastName || !email) {
      utils.showError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      utils.showError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      utils.showError('Password must be at least 6 characters');
      return;
    }
    
    if (!utils.isValidEmail(email)) {
      utils.showError('Please enter a valid email address');
      return;
    }
    
    try {
      // disable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Creating account...';
      }
      
      // register
      const userData = {
        username,
        password,
        firstName,
        lastName,
        email,
        phone,
        role: 'USER'
      };
      
      const response = await api.register(userData);
      
      // save token and user
      auth.setToken(response.token);
      auth.setUser(response.user);
      
      // redirect
      const redirect = utils.getQueryParam('redirect') || 'index.html';
      window.location.href = redirect;
      
    } catch (error) {
      // re-enable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
      
      utils.showError(error.message || 'Registration failed');
    }
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  authPage.init();
});
