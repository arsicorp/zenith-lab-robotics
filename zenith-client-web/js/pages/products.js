// products listing page - filters, categories, sorting

const products = {

  // initialize products page
  async init() {
    // Check for type parameter (robots or accessories)
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('type');

    // Update page title based on type
    const pageTitle = document.querySelector('h1');

    if (pageTitle) {
      if (productType === 'robots') {
        pageTitle.textContent = 'Robots';
      } else if (productType === 'accessories') {
        pageTitle.textContent = 'Accessories';
      } else {
        pageTitle.textContent = 'All Products';
      }
    }

    // Store product type for filtering
    this.productType = productType;

    await this.loadProducts();
  },
  // load and display products
  async loadProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    try {
      // show loading
      utils.showSkeletons('products-grid', 9);

      // Fetch all products and filter client-side for reliability
      let productList = await api.getProducts({});

      // Filter by type: robots (categories 1-6) or accessories (category 7)
      if (this.productType === 'robots') {
        productList = productList.filter(p => p.categoryId >= 1 && p.categoryId <= 6);
      } else if (this.productType === 'accessories') {
        productList = productList.filter(p => p.categoryId === 7);
      }

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
          <h3>No products found</h3>
          <p>Try adjusting your filters</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = productList.map(product => {
      // Check if product has image, otherwise use placeholder
      const imageHtml = product.imageUrl && product.imageUrl !== ''
        ? `<img src="${product.imageUrl}" alt="${product.name}">`
        : `<div class="product-image-placeholder"></div>`;

      return `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.productId}'">
          <div class="product-card-image">
            ${imageHtml}
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
