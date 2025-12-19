// checkout page - place order with buyer restriction validation

const checkout = {
  cartData: null,
  profile: null,
  
  // initialize checkout page
  async init() {
    // require login
    if (!auth.requireAuth()) return;
    
    await this.loadCheckoutData();
    this.setupForm();
  },
  
  // load cart and profile data
  async loadCheckoutData() {
    try {
      // load cart and profile
      const cartResponse = await api.getCart();
      this.profile = await api.getProfile();

      // handle items as Map (object) or array
      let items = [];
      if (cartResponse && cartResponse.items) {
        if (Array.isArray(cartResponse.items)) {
          items = cartResponse.items;
        } else if (typeof cartResponse.items === 'object') {
          items = Object.values(cartResponse.items);
        }
      }
      this.cartData = { items };

      // check if cart is empty
      if (items.length === 0) {
        window.location.href = 'cart.html';
        return;
      }

      // check buyer restrictions
      this.checkBuyerRestrictions();

      // display order review
      this.displayOrderReview();

      // pre-fill shipping form
      this.prefillForm();

    } catch (error) {
      utils.showError(error.message || 'Failed to load checkout data');
    }
  },
  
  // check if user can buy all items in cart
  checkBuyerRestrictions() {
    const accountType = this.profile.accountType;
    const items = this.cartData.items || [];
    
    const restrictedItems = items.filter(item => 
      !utils.canBuyProduct(accountType, item.product.buyerRequirement)
    );
    
    if (restrictedItems.length > 0) {
      const names = restrictedItems.map(i => i.product.name).join(', ');
      
      utils.showError(`
        Your account type (${accountType}) cannot purchase: ${names}. 
        Please remove these items from your cart or contact sales to upgrade your account.
      `);
      
      // disable checkout button
      const btn = document.getElementById('place-order-btn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Account Type Restriction';
      }
    }
  },
  
  // display order review
  displayOrderReview() {
    const container = document.getElementById('order-review');
    if (!container) return;
    
    const items = this.cartData.items || [];
    
    // calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = 0; // free shipping
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    container.innerHTML = `
      <h2>Order Review</h2>
      
      ${items.map(item => `
        <div class="order-item">
          <div class="order-item-info">
            <h4>${item.product.name}</h4>
            <p>Quantity: ${item.quantity} × ${utils.formatPrice(item.product.price)}</p>
          </div>
          <div>${utils.formatPrice(item.product.price * item.quantity)}</div>
        </div>
      `).join('')}
      
      <div class="summary-row mt-lg">
        <span>Subtotal</span>
        <span>${utils.formatPrice(subtotal)}</span>
      </div>
      
      <div class="summary-row">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      
      <div class="summary-row">
        <span>Tax (8%)</span>
        <span>${utils.formatPrice(tax)}</span>
      </div>
      
      <div class="summary-total">
        <span>Total</span>
        <span>${utils.formatPrice(total)}</span>
      </div>
    `;
  },
  
  // pre-fill form with profile data
  prefillForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    const p = this.profile;
    
    if (p.address) form.address.value = p.address;
    if (p.city) form.city.value = p.city;
    if (p.state) form.state.value = p.state;
    if (p.zip) form.zip.value = p.zip;
  },
  
  // setup form submission
  setupForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.placeOrder();
    });
  },
  
  // place order
  async placeOrder() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    // clear previous messages
    utils.clearMessages();
    
    // validate form
    if (!form.checkValidity()) {
      utils.showError('Please fill in all required fields');
      return;
    }
    
    // get form data
    const orderData = {
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      zip: form.zip.value
    };
    
    try {
      // disable button
      const btn = document.getElementById('place-order-btn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Processing...';
      }
      
      // create order
      const order = await api.createOrder(orderData);
      
      // clear cart badge
      nav.updateCartBadge();
      
      // redirect to success page
      window.location.href = `order-success.html?id=${order.orderId}`;
      
    } catch (error) {
      // re-enable button
      const btn = document.getElementById('place-order-btn');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Place Order';
      }
      
      // show error - buyer restriction errors are detailed
      utils.showError(error.message || 'Failed to place order');
      
      // scroll to top to see error
      utils.scrollToTop();
    }
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  checkout.init();
});
