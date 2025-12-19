// products listing page - filters, categories, sorting

const products = {
  currentFilters: {
    cat: null,
    minPrice: null,
    maxPrice: null,
    color: null
  },
  
  // initialize products page
  async init() {
    await this.loadCategories();
    await this.loadProducts();
    this.setupFilters();
  },
  
  // load categories for sidebar
  async loadCategories() {
    try {
      const categories = await api.getCategories();
      const container = document.getElementById('category-filters');
      if (!container) return;
      
      container.innerHTML = categories.map(cat => `
        <div class="form-check">
          <input type="radio" name="category" value="${cat.categoryId}" id="cat-${cat.categoryId}">
          <label for="cat-${cat.categoryId}">${cat.name}</label>
        </div>
      `).join('');
      
      // add "all categories" option
      container.insertAdjacentHTML('afterbegin', `
        <div class="form-check">
          <input type="radio" name="category" value="" id="cat-all" checked>
          <label for="cat-all">All Categories</label>
        </div>
      `);
      
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  },
  
  // load and display products
  async loadProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    try {
      // show loading
      utils.showSkeletons('products-grid', 9);
      
      // get products with filters
      const productList = await api.getProducts(this.currentFilters);
      
      // update count
      this.updateProductCount(productList.length);
      
      // display products
      this.displayProducts(productList);
      
    } catch (error) {
      container.innerHTML = `
        <div class="error-message" style="grid-column: 1 / -1;">
          Failed to load products. <button onclick="products.loadProducts()" class="btn btn-small btn-primary">Try Again</button>
        </div>
      `;
    }
  },
  
  // display products in grid
  displayProducts(productList) {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    if (productList.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🤖</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = productList.map(product => {
      const buyerText = utils.getBuyerRequirementText(product.buyerRequirement);
      
      return `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.productId}'">
          <div class="product-card-image" style="background: ${utils.getRobotGradient(product.name)}">
            ${buyerText ? `<span class="product-badge restricted">${buyerText}</span>` : ''}
          </div>
          <div class="product-card-content">
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-desc">${utils.truncate(product.description, 80)}</p>
            <div class="product-card-price">${utils.formatPrice(product.price)}</div>
            <div class="product-card-footer">
              <button class="btn btn-primary btn-small">View Details</button>
              <button class="btn btn-outline btn-small" onclick="event.stopPropagation(); products.addToCompare(${product.productId})">
                Compare
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },
  
  // update product count display
  updateProductCount(count) {
    const countEl = document.getElementById('products-count');
    if (countEl) {
      countEl.textContent = `${count} products`;
    }
  },
  
  // setup filter event listeners
  setupFilters() {
    // category filters
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    categoryInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.currentFilters.cat = e.target.value || null;
        this.loadProducts();
      });
    });
    
    // price filters
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput) {
      minPriceInput.addEventListener('change', utils.debounce((e) => {
        this.currentFilters.minPrice = e.target.value || null;
        this.loadProducts();
      }, 500));
    }
    
    if (maxPriceInput) {
      maxPriceInput.addEventListener('change', utils.debounce((e) => {
        this.currentFilters.maxPrice = e.target.value || null;
        this.loadProducts();
      }, 500));
    }
    
    // color filter
    const colorSelect = document.getElementById('color-filter');
    if (colorSelect) {
      colorSelect.addEventListener('change', (e) => {
        this.currentFilters.color = e.target.value || null;
        this.loadProducts();
      });
    }
    
    // clear filters button
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  },
  
  // clear all filters
  clearFilters() {
    this.currentFilters = {
      cat: null,
      minPrice: null,
      maxPrice: null,
      color: null
    };
    
    // reset form inputs
    document.getElementById('cat-all')?.click();
    
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const color = document.getElementById('color-filter');
    
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    if (color) color.value = '';
    
    this.loadProducts();
  },
  
  // add product to comparison list
  addToCompare(productId) {
    let compareList = JSON.parse(localStorage.getItem('compare_list') || '[]');
    
    if (compareList.includes(productId)) {
      alert('Product already in comparison list');
      return;
    }
    
    if (compareList.length >= 3) {
      alert('You can only compare up to 3 products');
      return;
    }
    
    compareList.push(productId);
    localStorage.setItem('compare_list', JSON.stringify(compareList));
    
    alert('Added to comparison! Go to Compare page to view.');
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  products.init();
});
