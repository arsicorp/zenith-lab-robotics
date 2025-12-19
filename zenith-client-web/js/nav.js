// navigation component - cart badge, account dropdown, mobile menu

const nav = {
  // initialize navigation
  init() {
    this.updateCartBadge();
    this.updateAccountDisplay();
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupAccountDropdown();
    this.highlightCurrentPage();
  },
  
  // update cart badge with item count
  async updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    if (!auth.isLoggedIn()) {
      badge.style.display = 'none';
      return;
    }

    try {
      const cart = await api.getCart();

      // handle items as Map (object) or array
      let itemCount = 0;
      if (cart.items) {
        if (Array.isArray(cart.items)) {
          itemCount = cart.items.length;
        } else if (typeof cart.items === 'object') {
          itemCount = Object.keys(cart.items).length;
        }
      }

      if (itemCount > 0) {
        badge.textContent = itemCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    } catch (error) {
      badge.style.display = 'none';
    }
  },
  
  // animate cart badge when item added
  bounceCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.classList.add('bounce');
      setTimeout(() => badge.classList.remove('bounce'), 400);
    }
  },
  
  // update account display (login button or user name)
  updateAccountDisplay() {
    const accountTrigger = document.getElementById('account-trigger');
    if (!accountTrigger) return;
    
    if (auth.isLoggedIn()) {
      const userName = auth.getUserName();
      accountTrigger.innerHTML = `
        <span>${userName}</span>
        <span>▼</span>
      `;
    } else {
      accountTrigger.innerHTML = 'Login';
      accountTrigger.onclick = () => {
        window.location.href = 'auth.html';
      };
    }
  },
  
  // setup account dropdown menu
  setupAccountDropdown() {
    const trigger = document.getElementById('account-trigger');
    const dropdown = document.getElementById('account-dropdown');
    
    if (!trigger || !dropdown) return;
    
    if (!auth.isLoggedIn()) return;
    
    trigger.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    };
    
    // close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
    });
    
    // logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        auth.logout();
      };
    }
  },
  
  // add scroll effect to navigation
  setupScrollEffect() {
    const navbar = document.querySelector('nav');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  },
  
  // setup mobile menu toggle
  setupMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    
    if (!toggle || !links) return;
    
    toggle.onclick = () => {
      links.classList.toggle('mobile-open');
    };
  },
  
  // highlight current page in navigation
  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (currentPath.includes(href) && href !== '/') {
        link.classList.add('active');
      } else if (currentPath === '/' && href === '/index.html') {
        link.classList.add('active');
      }
    });
  }
};

// initialize nav when page loads
document.addEventListener('DOMContentLoaded', () => {
  nav.init();
});
