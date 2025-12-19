// product detail page - show product info, specs, add to cart

const productDetail = {
  product: null,
  quantity: 1,
  
  // initialize page
  async init() {
    const productId = utils.getQueryParam('id');
    
    if (!productId) {
      window.location.href = 'products.html';
      return;
    }
    
    await this.loadProduct(productId);
    await this.loadAccessories();
    this.setupQuantityControls();
  },
  
  // load product details
  async loadProduct(id) {
    try {
      // show loading
      utils.showLoading('product-container');
      
      // get product
      this.product = await api.getProductById(id);
      
      // display product
      this.displayProduct();
      
    } catch (error) {
      const container = document.getElementById('product-container');
      if (container) {
        container.innerHTML = `
          <div class="error-message">
            Product not found. <a href="products.html">Back to Products</a>
          </div>
        `;
      }
    }
  },
  
  // display product information
  displayProduct() {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    const p = this.product;
    const buyerText = utils.getBuyerRequirementText(p.buyerRequirement);
    
    // check if user can buy this product
    const canBuy = auth.isLoggedIn() 
      ? utils.canBuyProduct(auth.getAccountType(), p.buyerRequirement)
      : true;
    
    container.innerHTML = `
      <div class="breadcrumb">
        <a href="index.html">Home</a> /
        <a href="products.html">Products</a> /
        <span>${p.name}</span>
      </div>
      
      <div class="product-layout">
        <div class="product-image-main" style="background: ${utils.getRobotGradient(p.name)}">
          <img src="${p.imageUrl || ''}" alt="${p.name}" onerror="this.style.display='none'" />
        </div>
        
        <div class="product-info">
          <h1>${p.name}</h1>
          <div class="product-color">${p.color || ''}</div>
          <div class="product-price">${utils.formatPrice(p.price)}</div>
          
          ${buyerText && auth.isLoggedIn() && !canBuy ? `
            <div class="buyer-warning">
              <div class="buyer-warning-icon">⚠️</div>
              <div class="buyer-warning-text">
                <h4>${buyerText}</h4>
                <p>Your account type does not allow purchasing this product. Contact sales for assistance.</p>
              </div>
            </div>
          ` : ''}
          
          ${buyerText && !auth.isLoggedIn() ? `
            <div class="alert alert-info">
              <strong>Note:</strong> ${buyerText}. Please login to check your eligibility.
            </div>
          ` : ''}
          
          <div class="product-actions">
            <div class="quantity-selector">
              <button class="quantity-btn" onclick="productDetail.decreaseQuantity()">-</button>
              <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="${p.stock}">
              <button class="quantity-btn" onclick="productDetail.increaseQuantity()">+</button>
            </div>
            <button class="btn btn-primary btn-large" onclick="productDetail.addToCart()" ${!auth.isLoggedIn() || (auth.isLoggedIn() && !canBuy) ? 'disabled' : ''}>
              ${!auth.isLoggedIn() ? 'Login to Purchase' : canBuy ? 'Add to Cart' : 'Not Available'}
            </button>
          </div>
          
          <p>${p.description}</p>
          
          ${p.useCases ? `
            <div class="mt-lg">
              <strong>Use Cases:</strong>
              <p class="text-muted">${p.useCases.split(',').join(', ')}</p>
            </div>
          ` : ''}
        </div>
      </div>
      
      ${this.renderSpecs()}
    `;
  },
  
  // render specifications table
  renderSpecs() {
    const p = this.product;
    
    // check if this is a robot (has specs)
    if (!p.aiModel) return '';
    
    return `
      <div class="specs-section">
        <h2>Technical Specifications</h2>
        <div class="specs-grid">
          ${p.aiModel ? `
            <div class="spec-item">
              <div class="spec-label">AI Model</div>
              <div class="spec-value">${p.aiModel}</div>
            </div>
          ` : ''}
          ${p.heightCm ? `
            <div class="spec-item">
              <div class="spec-label">Height</div>
              <div class="spec-value">${p.heightCm} cm</div>
            </div>
          ` : ''}
          ${p.weightKg ? `
            <div class="spec-item">
              <div class="spec-label">Weight</div>
              <div class="spec-value">${p.weightKg} kg</div>
            </div>
          ` : ''}
          ${p.payloadKg ? `
            <div class="spec-item">
              <div class="spec-label">Payload Capacity</div>
              <div class="spec-value">${p.payloadKg} kg</div>
            </div>
          ` : ''}
          ${p.batteryHours ? `
            <div class="spec-item">
              <div class="spec-label">Battery Life</div>
              <div class="spec-value">${p.batteryHours} hours</div>
            </div>
          ` : ''}
          ${p.speedKmh ? `
            <div class="spec-item">
              <div class="spec-label">Max Speed</div>
              <div class="spec-value">${p.speedKmh} km/h</div>
            </div>
          ` : ''}
          ${p.autonomyLevel ? `
            <div class="spec-item">
              <div class="spec-label">Autonomy Level</div>
              <div class="spec-value">${p.autonomyLevel}</div>
            </div>
          ` : ''}
          ${p.warrantyYears ? `
            <div class="spec-item">
              <div class="spec-label">Warranty</div>
              <div class="spec-value">${p.warrantyYears} years</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },
  
  // load compatible accessories
  async loadAccessories() {
    const container = document.getElementById('accessories-grid');
    if (!container) return;
    
    const p = this.product;
    
    // check if this product has compatible accessories (for robots)
    if (!p.compatibleRobots) {
      document.getElementById('accessories-section')?.remove();
      return;
    }
    
    try {
      // get all products
      const products = await api.getProducts();
      
      // filter accessories compatible with this robot
      const accessories = products.filter(item => 
        item.compatibleRobots && 
        item.compatibleRobots.includes(p.name.split(' ')[0].toUpperCase())
      );
      
      if (accessories.length === 0) {
        document.getElementById('accessories-section')?.remove();
        return;
      }
      
      // display accessories
      container.innerHTML = accessories.slice(0, 4).map(acc => `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${acc.productId}'">
          <div class="product-card-image" style="background: var(--gray-100)"></div>
          <div class="product-card-content">
            <h4>${acc.name}</h4>
            <div class="product-card-price">${utils.formatPrice(acc.price)}</div>
          </div>
        </div>
      `).join('');
      
    } catch (error) {
      console.error('Failed to load accessories:', error);
    }
  },
  
  // setup quantity controls
  setupQuantityControls() {
    const input = document.getElementById('quantity');
    if (!input) return;
    
    input.addEventListener('change', (e) => {
      let value = parseInt(e.target.value);
      if (isNaN(value) || value < 1) value = 1;
      if (value > this.product.stock) value = this.product.stock;
      e.target.value = value;
      this.quantity = value;
    });
  },
  
  // increase quantity
  increaseQuantity() {
    const input = document.getElementById('quantity');
    if (!input) return;
    
    let value = parseInt(input.value) + 1;
    if (value > this.product.stock) value = this.product.stock;
    input.value = value;
    this.quantity = value;
  },
  
  // decrease quantity
  decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (!input) return;
    
    let value = parseInt(input.value) - 1;
    if (value < 1) value = 1;
    input.value = value;
    this.quantity = value;
  },
  
  // add product to cart
  async addToCart() {
    if (!auth.isLoggedIn()) {
      window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    try {
      // add to cart
      await api.addToCart(this.product.productId, this.quantity);
      
      // update cart badge
      nav.updateCartBadge();
      nav.bounceCartBadge();
      
      // show success
      alert('Added to cart!');
      
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    }
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  productDetail.init();
});
