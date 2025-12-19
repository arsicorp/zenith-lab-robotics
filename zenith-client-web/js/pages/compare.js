// product comparison page - compare 2-3 robots side by side with dropdown selection

const compare = {
  selectedProducts: [],
  allProducts: [],
  showingComparison: false,

  // initialize compare page
  async init() {
    await this.loadAllProducts();
    this.showSelectionInterface();
  },

  // load all robot products for dropdown
  async loadAllProducts() {
    try {
      // Get all products and filter to robots only (categories 1-6)
      const allProducts = await api.getProducts({});
      this.allProducts = allProducts.filter(p => p.categoryId >= 1 && p.categoryId <= 6);
    } catch (error) {
      const container = document.getElementById('compare-container');
      if (container) {
        container.innerHTML = `
          <div class="error-message">
            Failed to load products. <button onclick="compare.init()" class="btn btn-small btn-primary">Try Again</button>
          </div>
        `;
      }
    }
  },

  // show dropdown selection interface - three column horizontal layout
  showSelectionInterface() {
    const container = document.getElementById('compare-container');
    if (!container) return;

    this.showingComparison = false;

    container.innerHTML = `
      <div class="compare-selection">
        <div class="selection-dropdowns-horizontal">
          ${this.renderDropdown(0, 'Select Robot 1')}
          ${this.renderDropdown(1, 'Select Robot 2')}
          ${this.renderDropdown(2, 'Select Robot 3')}
        </div>

        <div class="selection-actions">
          <button class="btn btn-primary" onclick="compare.showComparison()" id="compare-btn" disabled>
            Compare
          </button>
          <button class="btn btn-outline" onclick="compare.clearAll()">
            Clear
          </button>
        </div>
      </div>
    `;

    // Setup dropdown event listeners
    this.setupDropdowns();
  },

  // render dropdown for robot selection
  renderDropdown(index, label) {
    return `
      <div class="selection-column">
        <label class="selection-label">${label}${index === 2 ? ' (Optional)' : ''}</label>
        <select class="form-select selection-dropdown" data-index="${index}">
          <option value="">Select a robot...</option>
          ${this.allProducts.map(p => `
            <option value="${p.productId}">${p.name} - ${utils.formatPrice(p.price)}</option>
          `).join('')}
        </select>
      </div>
    `;
  },

  // setup dropdown event listeners
  setupDropdowns() {
    const dropdowns = document.querySelectorAll('.selection-dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const productId = e.target.value ? parseInt(e.target.value) : null;

        // Update selected products array
        this.selectedProducts[index] = productId;

        // Update compare button state
        this.updateCompareButton();
      });
    });
  },

  // update compare button enabled/disabled state
  updateCompareButton() {
    const compareBtn = document.getElementById('compare-btn');
    if (!compareBtn) return;

    // Count valid selections (non-null)
    const validSelections = this.selectedProducts.filter(id => id !== null && id !== undefined).length;

    // Enable button if 2 or 3 products selected
    compareBtn.disabled = validSelections < 2;
  },

  // show comparison table
  async showComparison() {
    // Filter out null/undefined selections
    const productIds = this.selectedProducts.filter(id => id !== null && id !== undefined);

    if (productIds.length < 2) {
      alert('Please select at least 2 robots to compare');
      return;
    }

    try {
      // Show loading
      const container = document.getElementById('compare-container');
      utils.showLoading('compare-container');

      // Get product details
      const products = await api.compareProducts(productIds);

      this.showingComparison = true;

      // Display comparison with product cards and table
      container.innerHTML = `
        <div class="comparison-actions">
          <button class="btn btn-secondary" onclick="compare.showSelectionInterface()">
            Back to Selection
          </button>
          <button class="btn btn-outline" onclick="compare.clearAll()">
            Clear All
          </button>
        </div>

        <div class="compare-products-row">
          ${products.map(p => this.renderProductCard(p)).join('')}
        </div>

        <div class="compare-table-wrapper">
          <table class="compare-table">
            <tbody>
              ${this.renderRow('Category', products, p => this.getCategoryName(p.categoryId))}
              ${this.renderRow('Color', products, p => p.color)}
              ${this.renderRow('Buyer Requirement', products, p => utils.getBuyerRequirementText(p.buyerRequirement) || 'None')}
              ${this.renderRow('AI Model', products, p => p.aiModel)}
              ${this.renderRow('Height', products, p => p.heightCm ? `${p.heightCm} cm` : '-')}
              ${this.renderRow('Weight', products, p => p.weightKg ? `${p.weightKg} kg` : '-')}
              ${this.renderRow('Payload Capacity', products, p => p.payloadKg ? `${p.payloadKg} kg` : '-')}
              ${this.renderRow('Battery Life', products, p => p.batteryHours ? `${p.batteryHours} hours` : '-')}
              ${this.renderRow('Max Speed', products, p => p.speedKmh ? `${p.speedKmh} km/h` : '-')}
              ${this.renderRow('Autonomy Level', products, p => p.autonomyLevel || '-')}
              ${this.renderRow('Warranty', products, p => p.warrantyYears ? `${p.warrantyYears} years` : '-')}
            </tbody>
          </table>
        </div>
      `;

    } catch (error) {
      alert('Failed to load comparison. Please try again.');
    }
  },

  // render product card for comparison results
  renderProductCard(product) {
    const imageHtml = product.imageUrl && product.imageUrl !== ''
      ? `<img src="${product.imageUrl}" alt="${product.name}" />`
      : `<div class="product-image-placeholder"></div>`;

    return `
      <div class="compare-product-card">
        <div class="compare-product-image">
          ${imageHtml}
        </div>
        <h3 class="compare-product-name">${product.name}</h3>
        <div class="compare-product-price">${utils.formatPrice(product.price)}</div>
        <div class="compare-product-actions">
          <button class="btn btn-primary btn-small" onclick="compare.addToCart(${product.productId})">
            Add to Cart
          </button>
          <button class="btn btn-outline btn-small" onclick="window.location.href='product-detail.html?id=${product.productId}'">
            View Details
          </button>
        </div>
      </div>
    `;
  },

  // get category name from ID
  getCategoryName(categoryId) {
    const categories = {
      1: 'Household',
      2: 'Industrial',
      3: 'Medical',
      4: 'Military',
      5: 'Research',
      6: 'Hazard'
    };
    return categories[categoryId] || '-';
  },

  // render generic row
  renderRow(label, products, getValue) {
    return `
      <tr>
        <th>${label}</th>
        ${products.map(p => {
          const value = getValue(p);
          return `<td>${value || '-'}</td>`;
        }).join('')}
      </tr>
    `;
  },

  // add to cart from comparison
  async addToCart(productId) {
    if (!auth.isLoggedIn()) {
      window.location.href = 'auth.html';
      return;
    }

    try {
      await api.addToCart(productId, 1);
      nav.updateCartBadge();
      nav.bounceCartBadge();
      alert('Added to cart!');
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    }
  },

  // clear all selections
  clearAll() {
    this.selectedProducts = [];
    this.showSelectionInterface();
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  compare.init();
});
