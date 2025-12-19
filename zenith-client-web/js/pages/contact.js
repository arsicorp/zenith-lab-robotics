// contact page - sales inquiry form

const contact = {
  // initialize contact page
  async init() {
    await this.loadProducts();
    this.setupForm();
  },
  
  // load products for dropdown
  async loadProducts() {
    const select = document.getElementById('product-select');
    if (!select) return;
    
    try {
      const products = await api.getProducts();
      
      // filter main robots only
      const robots = products.filter(p => p.categoryId >= 1 && p.categoryId <= 6);
      
      // populate select
      select.innerHTML = '<option value="">Select a product (optional)</option>' +
        robots.map(p => `<option value="${p.productId}">${p.name}</option>`).join('');
      
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  },
  
  // setup form
  setupForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitInquiry();
    });
  },
  
  // submit inquiry
  async submitInquiry() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    utils.clearMessages();
    
    // validate
    if (!form.checkValidity()) {
      utils.showError('Please fill in all required fields');
      return;
    }
    
    // validate email
    if (!utils.isValidEmail(form.email.value)) {
      utils.showError('Please enter a valid email address');
      return;
    }
    
    const data = {
      productId: form.product.value ? parseInt(form.product.value) : null,
      contactName: form.name.value.trim(),
      companyName: form.company.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };
    
    try {
      // disable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }
      
      // submit inquiry
      await api.submitSalesInquiry(data);
      
      // show success
      utils.showSuccess('Thank you for your inquiry! Our sales team will contact you within 24 hours.');
      
      // reset form
      form.reset();
      
      // re-enable button
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Inquiry';
      }
      
      // scroll to success message
      utils.scrollToTop();
      
    } catch (error) {
      // re-enable button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Inquiry';
      }
      
      utils.showError(error.message || 'Failed to submit inquiry');
    }
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  contact.init();
});
