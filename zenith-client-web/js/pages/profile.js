// profile page - user info and order history

const profile = {
  profileData: null,
  orders: [],
  
  // initialize profile page
  async init() {
    // require login
    if (!auth.requireAuth()) return;
    
    await this.loadProfile();
    await this.loadOrders();
    this.setupTabs();
    this.setupForm();
  },
  
  // load profile data
  async loadProfile() {
    try {
      this.profileData = await api.getProfile();
      this.displayProfile();
    } catch (error) {
      utils.showError('Failed to load profile');
    }
  },
  
  // display profile info
  displayProfile() {
    const container = document.getElementById('profile-info');
    if (!container) return;
    
    const p = this.profileData;
    
    container.innerHTML = `
      <div class="profile-avatar">
        ${p.firstName.charAt(0)}${p.lastName.charAt(0)}
      </div>
      <div class="profile-name">${p.firstName} ${p.lastName}</div>
      <div class="profile-email">${p.email}</div>
      
      <div class="mt-lg text-muted" style="font-size: 0.875rem;">
        <p><strong>Account Type:</strong> ${p.accountType}</p>
        ${p.companyName ? `<p><strong>Company:</strong> ${p.companyName}</p>` : ''}
        ${p.phone ? `<p><strong>Phone:</strong> ${p.phone}</p>` : ''}
      </div>
    `;
    
    // pre-fill edit form
    this.prefillForm();
  },
  
  // pre-fill edit form
  prefillForm() {
    const form = document.getElementById('profile-form');
    if (!form || !this.profileData) return;
    
    const p = this.profileData;
    
    form.firstName.value = p.firstName || '';
    form.lastName.value = p.lastName || '';
    form.email.value = p.email || '';
    form.phone.value = p.phone || '';
    form.address.value = p.address || '';
    form.city.value = p.city || '';
    form.state.value = p.state || '';
    form.zip.value = p.zip || '';
  },
  
  // setup form
  setupForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateProfile();
    });
  },
  
  // update profile
  async updateProfile() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    
    utils.clearMessages();
    
    if (!form.checkValidity()) {
      utils.showError('Please fill in all required fields', 'profile-messages');
      return;
    }
    
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value.trim(),
      zip: form.zip.value.trim()
    };
    
    try {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Saving...';
      }
      
      await api.updateProfile(data);
      
      // reload profile
      await this.loadProfile();
      
      utils.showSuccess('Profile updated successfully!', 'profile-messages');
      
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      }
      
    } catch (error) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      }
      
      utils.showError(error.message || 'Failed to update profile', 'profile-messages');
    }
  },
  
  // load order history
  async loadOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    try {
      utils.showLoading('orders-list');
      
      this.orders = await api.getOrders();
      this.displayOrders();
      
    } catch (error) {
      container.innerHTML = `
        <div class="error-message">
          Failed to load orders. <button onclick="profile.loadOrders()" class="btn btn-small btn-primary">Try Again</button>
        </div>
      `;
    }
  },
  
  // display orders
  displayOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    if (this.orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No orders yet</h3>
          <p>Your order history will appear here.</p>
          <a href="products.html" class="btn btn-primary mt-lg">Start Shopping</a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-number">Order #${order.orderId}</div>
            <div class="order-date">${utils.formatDate(order.date)}</div>
          </div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--blue);">
            ${utils.formatPrice(order.orderTotal)}
          </div>
        </div>
        <div>
          <p class="text-muted" style="margin: 0;">
            ${order.address}, ${order.city}, ${order.state} ${order.zip}
          </p>
        </div>
      </div>
    `).join('');
  },
  
  // setup tabs
  setupTabs() {
    const profileTab = document.getElementById('profile-tab');
    const ordersTab = document.getElementById('orders-tab');
    const profileContent = document.getElementById('profile-content');
    const ordersContent = document.getElementById('orders-content');
    
    if (!profileTab || !ordersTab || !profileContent || !ordersContent) return;
    
    profileTab.addEventListener('click', () => {
      profileTab.classList.add('active');
      ordersTab.classList.remove('active');
      profileContent.style.display = 'block';
      ordersContent.style.display = 'none';
    });
    
    ordersTab.addEventListener('click', () => {
      ordersTab.classList.add('active');
      profileTab.classList.remove('active');
      ordersContent.style.display = 'block';
      profileContent.style.display = 'none';
    });
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  profile.init();
});
