// shopping cart page - view items, update quantities, checkout

const cart = {
  cartData: null,
  
  // initialize cart page
  async init() {
    // require login
    if (!auth.requireAuth()) return;
    
    await this.loadCart();
  },
  
  // load cart from api
  async loadCart() {
    try {
      // show loading
      utils.showLoading('cart-items');
      
      // get cart
      this.cartData = await api.getCart();
      
      // display cart
      this.displayCart();
      
    } catch (error) {
      const container = document.getElementById('cart-items');
      if (container) {
        container.innerHTML = `
          <div class="error-message">
            Failed to load cart. <button onclick="cart.loadCart()" class="btn btn-small btn-primary">Try Again</button>
          </div>
        `;
      }
    }
  },
  
  // display cart items and summary
  displayCart() {
    const itemsContainer = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-summary');
    
    if (!itemsContainer || !summaryContainer) return;
    
    const items = this.cartData.items || [];
    
    // show empty state if no items
    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some robots to get started!</p>
          <a href="products.html" class="btn btn-primary mt-lg">Browse Products</a>
        </div>
      `;
      summaryContainer.innerHTML = '';
      return;
    }
    
    // display items
    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item" data-product-id="${item.product.productId}">
        <div class="cart-item-image" style="background: ${utils.getRobotGradient(item.product.name)}">
          <img src="${item.product.imageUrl || ''}" alt="${item.product.name}" onerror="this.style.display='none'" />
        </div>
        
        <div class="cart-item-details">
          <h3>${item.product.name}</h3>
          <div class="cart-item-price">${utils.formatPrice(item.product.price)}</div>
          <div class="cart-item-actions">
            <div class="quantity-selector">
              <button class="quantity-btn" onclick="cart.updateQuantity(${item.product.productId}, ${item.quantity - 1})">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" readonly>
              <button class="quantity-btn" onclick="cart.updateQuantity(${item.product.productId}, ${item.quantity + 1})">+</button>
            </div>
          </div>
        </div>
        
        <div class="cart-item-right">
          <div style="font-size: 1.25rem; font-weight: 700;">${utils.formatPrice(item.product.price * item.quantity)}</div>
          <button class="cart-item-remove" onclick="cart.removeItem(${item.product.productId})">Remove</button>
        </div>
      </div>
    `).join('');
    
    // display summary
    this.displaySummary();
  },
  
  // display cart summary
  displaySummary() {
    const container = document.getElementById('cart-summary');
    if (!container) return;
    
    const items = this.cartData.items || [];
    
    // calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 0 : 0; // free shipping
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    container.innerHTML = `
      <h2>Order Summary</h2>
      
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${utils.formatPrice(subtotal)}</span>
      </div>
      
      <div class="summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? 'Free' : utils.formatPrice(shipping)}</span>
      </div>
      
      <div class="summary-row">
        <span>Tax (8%)</span>
        <span>${utils.formatPrice(tax)}</span>
      </div>
      
      <div class="summary-total">
        <span>Total</span>
        <span>${utils.formatPrice(total)}</span>
      </div>
      
      <button class="btn btn-primary btn-large btn-full" onclick="cart.proceedToCheckout()">
        Proceed to Checkout
      </button>
      
      <button class="btn btn-secondary btn-full mt-md" onclick="cart.clearCart()">
        Clear Cart
      </button>
    `;
  },
  
  // update item quantity
  async updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      this.removeItem(productId);
      return;
    }
    
    try {
      await api.updateCartItem(productId, newQuantity);
      await this.loadCart();
      
      // update nav badge
      nav.updateCartBadge();
      
    } catch (error) {
      alert(error.message || 'Failed to update cart');
    }
  },
  
  // remove item from cart
  async removeItem(productId) {
    if (!confirm('Remove this item from cart?')) return;
    
    try {
      await api.updateCartItem(productId, 0);
      await this.loadCart();
      
      // update nav badge
      nav.updateCartBadge();
      
    } catch (error) {
      alert(error.message || 'Failed to remove item');
    }
  },
  
  // clear entire cart
  async clearCart() {
    if (!confirm('Remove all items from cart?')) return;
    
    try {
      await api.clearCart();
      await this.loadCart();
      
      // update nav badge
      nav.updateCartBadge();
      
    } catch (error) {
      alert(error.message || 'Failed to clear cart');
    }
  },
  
  // proceed to checkout
  proceedToCheckout() {
    const items = this.cartData.items || [];
    
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    window.location.href = 'checkout.html';
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  cart.init();
});
