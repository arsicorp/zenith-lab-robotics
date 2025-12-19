// product comparison page - compare up to 3 products side by side

const compare = {
  compareList: [],
  products: [],
  
  // initialize compare page
  async init() {
    this.loadCompareList();
    
    if (this.compareList.length === 0) {
      this.showEmptyState();
      return;
    }
    
    await this.loadProducts();
    this.displayComparison();
  },
  
  // load compare list from local storage
  loadCompareList() {
    const stored = localStorage.getItem('compare_list');
    this.compareList = stored ? JSON.parse(stored) : [];
  },
  
  // show empty state
  showEmptyState() {
    const container = document.getElementById('compare-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚖️</div>
        <h3>No products to compare</h3>
        <p>Add products from the products page to compare them side by side.</p>
        <a href="products.html" class="btn btn-primary mt-lg">Browse Products</a>
      </div>
    `;
  },
  
  // load products data
  async loadProducts() {
    try {
      // show loading
      utils.showLoading('compare-container');
      
      // get products
      this.products = await api.compareProducts(this.compareList);
      
    } catch (error) {
      const container = document.getElementById('compare-container');
      if (container) {
        container.innerHTML = `
          <div class="error-message">
            Failed to load products. <button onclick="compare.loadProducts()" class="btn btn-small btn-primary">Try Again</button>
          </div>
        `;
      }
    }
  },
  
  // display comparison table
  displayComparison() {
    const container = document.getElementById('compare-container');
    if (!container) return;
    
    if (this.products.length === 0) {
      this.showEmptyState();
      return;
    }
    
    container.innerHTML = `
      <div class="mb-lg">
        <button class="btn btn-secondary" onclick="compare.clearAll()">Clear All</button>
      </div>
      
      <table class="compare-table">
        <tbody>
          ${this.renderImageRow()}
          ${this.renderNameRow()}
          ${this.renderPriceRow()}
          ${this.renderRow('Category', p => p.categoryId)}
          ${this.renderRow('Color', p => p.color)}
          ${this.renderRow('Buyer Requirement', p => utils.getBuyerRequirementText(p.buyerRequirement) || 'None')}
          ${this.renderRow('AI Model', p => p.aiModel)}
          ${this.renderRow('Height', p => p.heightCm ? `${p.heightCm} cm` : '-')}
          ${this.renderRow('Weight', p => p.weightKg ? `${p.weightKg} kg` : '-')}
          ${this.renderRow('Payload', p => p.payloadKg ? `${p.payloadKg} kg` : '-')}
          ${this.renderRow('Battery Life', p => p.batteryHours ? `${p.batteryHours} hours` : '-')}
          ${this.renderRow('Max Speed', p => p.speedKmh ? `${p.speedKmh} km/h` : '-')}
          ${this.renderRow('Autonomy Level', p => p.autonomyLevel)}
          ${this.renderRow('Warranty', p => p.warrantyYears ? `${p.warrantyYears} years` : '-')}
          ${this.renderActionRow()}
        </tbody>
      </table>
    `;
  },
  
  // render image row
  renderImageRow() {
    return `
      <tr>
        <th>Image</th>
        ${this.products.map(p => `
          <td>
            <div class="compare-image" style="background: ${utils.getRobotGradient(p.name)}"></div>
          </td>
        `).join('')}
      </tr>
    `;
  },
  
  // render name row
  renderNameRow() {
    return `
      <tr>
        <th>Product</th>
        ${this.products.map(p => `
          <td><strong>${p.name}</strong></td>
        `).join('')}
      </tr>
    `;
  },
  
  // render price row
  renderPriceRow() {
    return `
      <tr>
        <th>Price</th>
        ${this.products.map(p => `
          <td><strong style="color: var(--blue); font-size: 1.25rem;">${utils.formatPrice(p.price)}</strong></td>
        `).join('')}
      </tr>
    `;
  },
  
  // render generic row
  renderRow(label, getValue) {
    return `
      <tr>
        <th>${label}</th>
        ${this.products.map(p => {
          const value = getValue(p);
          return `<td>${value || '-'}</td>`;
        }).join('')}
      </tr>
    `;
  },
  
  // render action buttons row
  renderActionRow() {
    return `
      <tr>
        <th>Actions</th>
        ${this.products.map(p => `
          <td>
            <button class="btn btn-primary btn-small btn-full mb-sm" onclick="window.location.href='product-detail.html?id=${p.productId}'">
              View Details
            </button>
            <button class="btn btn-secondary btn-small btn-full" onclick="compare.removeProduct(${p.productId})">
              Remove
            </button>
          </td>
        `).join('')}
      </tr>
    `;
  },
  
  // remove product from comparison
  removeProduct(productId) {
    this.compareList = this.compareList.filter(id => id !== productId);
    localStorage.setItem('compare_list', JSON.stringify(this.compareList));
    
    // reload page
    window.location.reload();
  },
  
  // clear all products
  clearAll() {
    if (!confirm('Remove all products from comparison?')) return;
    
    localStorage.removeItem('compare_list');
    window.location.reload();
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  compare.init();
});
