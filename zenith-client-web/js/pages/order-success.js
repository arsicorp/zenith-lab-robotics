// order success page - display order confirmation

const orderSuccess = {
  orderId: null,
  orderData: null,

  // initialize page
  async init() {
    // require login
    if (!auth.requireAuth()) return;

    // get order id from url
    this.orderId = utils.getQueryParam('id');

    // redirect if no order id
    if (!this.orderId) {
      window.location.href = 'profile.html#orders';
      return;
    }

    await this.loadOrder();
  },

  // load order details
  async loadOrder() {
    try {
      // show loading
      utils.showLoading('order-summary');

      // get order
      this.orderData = await api.getOrderById(this.orderId);

      // display order info and summary
      this.displayOrderInfo();
      this.displayOrderSummary();

    } catch (error) {
      // hide loading
      const container = document.getElementById('order-summary');
      if (container) {
        container.innerHTML = '';
      }

      // show error
      utils.showError(
        error.message || 'Failed to load order details. The order may not exist or you may not have permission to view it.'
      );

      // offer retry and navigation
      const errorContainer = document.getElementById('error-container');
      if (errorContainer) {
        errorContainer.innerHTML += `
          <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center;">
            <button onclick="orderSuccess.loadOrder()" class="btn btn-primary btn-small">Try Again</button>
            <a href="profile.html#orders" class="btn btn-secondary btn-small">View All Orders</a>
          </div>
        `;
      }
    }
  },

  // display order info section
  displayOrderInfo() {
    const container = document.getElementById('order-info');
    if (!container) return;

    const order = this.orderData;

    container.innerHTML = `
      <div style="background: var(--gray-100); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Order Number</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--blue); margin-bottom: 1rem;">#${order.orderId}</div>

        <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Order Date</div>
        <div style="font-size: 1rem; color: var(--gray-800);">${utils.formatDate(order.date)}</div>
      </div>
    `;
  },

  // display order summary
  displayOrderSummary() {
    const container = document.getElementById('order-summary');
    if (!container) return;

    const order = this.orderData;

    // calculate totals
    const subtotal = order.orderTotal / 1.08; // reverse calculate from total (8% tax)
    const tax = order.orderTotal - subtotal;
    const shipping = 0; // free shipping

    container.innerHTML = `
      <div class="checkout-section">
        <h2>Order Summary</h2>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Shipping Address</h3>
          <p style="color: var(--gray-600); margin: 0;">
            ${order.address}<br>
            ${order.city}, ${order.state} ${order.zip}
          </p>
        </div>

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
          <span>${utils.formatPrice(order.orderTotal)}</span>
        </div>

        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--gray-200);">
          <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">
            A confirmation email has been sent to your registered email address.
            You can view this order anytime in your order history.
          </p>
        </div>
      </div>
    `;
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  orderSuccess.init();
});
