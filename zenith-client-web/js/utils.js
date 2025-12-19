// utility functions used across the site

const utils = {
  // format price with commas and decimals
  formatPrice(price) {
    return '$' + parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },
  
  // format date to readable string
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  // show error message
  showError(message, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="error-message">
        <strong>Error:</strong> ${message}
      </div>
    `;
    container.style.display = 'block';
    
    // scroll to error
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
  
  // show success message
  showSuccess(message, containerId = 'success-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="success-message">
        ${message}
      </div>
    `;
    container.style.display = 'block';
    
    // auto hide after 5 seconds
    setTimeout(() => {
      container.style.display = 'none';
    }, 5000);
  },
  
  // clear messages
  clearMessages() {
    const errorContainer = document.getElementById('error-container');
    const successContainer = document.getElementById('success-container');
    
    if (errorContainer) errorContainer.style.display = 'none';
    if (successContainer) successContainer.style.display = 'none';
  },
  
  // show loading spinner
  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
      </div>
    `;
  },
  
  // show skeleton loaders
  showSkeletons(containerId, count = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="product-card">
          <div class="product-card-image skeleton" style="height: 280px;"></div>
          <div class="product-card-content">
            <div class="skeleton" style="height: 24px; width: 70%; margin-bottom: 8px;"></div>
            <div class="skeleton" style="height: 16px; width: 100%; margin-bottom: 16px;"></div>
            <div class="skeleton" style="height: 32px; width: 40%;"></div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },
  
  // get query parameter from url
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  // update query parameter in url
  updateQueryParam(param, value) {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(param, value);
    } else {
      url.searchParams.delete(param);
    }
    window.history.pushState({}, '', url);
  },
  
  // check if user can buy product based on account type and buyer requirement
  canBuyProduct(accountType, buyerRequirement) {
    if (!buyerRequirement || buyerRequirement === 'NONE') {
      return true;
    }
    
    if (buyerRequirement === 'BUSINESS') {
      return accountType === 'BUSINESS';
    }
    
    if (buyerRequirement === 'MEDICAL') {
      return accountType === 'MEDICAL';
    }
    
    if (buyerRequirement === 'GOVERNMENT') {
      return accountType === 'GOVERNMENT';
    }
    
    return false;
  },
  
  // get buyer requirement display text
  getBuyerRequirementText(requirement) {
    const texts = {
      'NONE': '',
      'BUSINESS': 'Business Account Required',
      'MEDICAL': 'Medical Account Required',
      'GOVERNMENT': 'Government Authorization Required'
    };
    return texts[requirement] || '';
  },
  
  // truncate text to max length
  truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  
  // debounce function for search inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // validate email format
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  // validate phone format (basic)
  isValidPhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return phone.length >= 10 && re.test(phone);
  },
  
  // generate robot color gradient for placeholder images
  getRobotGradient(robotName) {
    const colors = config.robotColors;
    const color = colors[robotName.toUpperCase()] || '#E0E0E0';
    return `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
  },
  
  // scroll to top of page
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
