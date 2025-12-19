// all api calls to backend

const api = {
  // base url from config
  baseUrl: config.apiUrl,
  
  // authentication endpoints
  async login(username, password) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Invalid username or password');
    }
    
    return await response.json();
  },
  
  async register(userData) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }
    
    return await response.json();
  },
  
  // products endpoints
  async getProducts(filters = {}) {
    let url = `${this.baseUrl}/products`;
    const params = new URLSearchParams();
    
    if (filters.cat) params.append('cat', filters.cat);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.color) params.append('color', filters.color);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    
    return await response.json();
  },
  
  async getProductById(id) {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Product not found');
    }
    
    return await response.json();
  },
  
  async compareProducts(ids) {
    const idsParam = ids.join(',');
    const response = await fetch(`${this.baseUrl}/products/compare?ids=${idsParam}`);
    
    if (!response.ok) {
      throw new Error('Failed to compare products');
    }
    
    return await response.json();
  },
  
  // categories endpoints
  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to load categories');
    }
    
    return await response.json();
  },
  
  async getCategoryById(id) {
    const response = await fetch(`${this.baseUrl}/categories/${id}`);
    
    if (!response.ok) {
      throw new Error('Category not found');
    }
    
    return await response.json();
  },
  
  // shopping cart endpoints
  async getCart() {
    const response = await fetch(`${this.baseUrl}/cart`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please login to view cart');
      }
      throw new Error('Failed to load cart');
    }
    
    return await response.json();
  },
  
  async addToCart(productId, quantity = 1) {
    const response = await fetch(`${this.baseUrl}/cart/products/${productId}`, {
      method: 'POST',
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please login to add items to cart');
      }
      throw new Error('Failed to add item to cart');
    }
    
    return await response.json();
  },
  
  async updateCartItem(productId, quantity) {
    const response = await fetch(`${this.baseUrl}/cart/products/${productId}`, {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update cart');
    }
    
    return await response.json();
  },
  
  async clearCart() {
    const response = await fetch(`${this.baseUrl}/cart`, {
      method: 'DELETE',
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
    
    return true;
  },
  
  // profile endpoints
  async getProfile() {
    const response = await fetch(`${this.baseUrl}/profile`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please login to view profile');
      }
      throw new Error('Failed to load profile');
    }
    
    return await response.json();
  },
  
  async updateProfile(profileData) {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  },
  
  // orders endpoints
  async createOrder(orderData) {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const error = await response.text();
      
      // check for buyer restriction error
      if (response.status === 403) {
        throw new Error(error || 'You do not have the required account type to purchase this product');
      }
      
      throw new Error(error || 'Failed to create order');
    }
    
    return await response.json();
  },
  
  async getOrders() {
    const response = await fetch(`${this.baseUrl}/orders`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please login to view orders');
      }
      throw new Error('Failed to load orders');
    }
    
    return await response.json();
  },
  
  async getOrderById(id) {
    const response = await fetch(`${this.baseUrl}/orders/${id}`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Order not found');
    }
    
    return await response.json();
  },
  
  // jobs endpoints
  async getJobs() {
    const response = await fetch(`${this.baseUrl}/jobs`);
    
    if (!response.ok) {
      throw new Error('Failed to load jobs');
    }
    
    return await response.json();
  },
  
  async getJobById(id) {
    const response = await fetch(`${this.baseUrl}/jobs/${id}`);
    
    if (!response.ok) {
      throw new Error('Job not found');
    }
    
    return await response.json();
  },
  
  async submitJobApplication(applicationData) {
    const response = await fetch(`${this.baseUrl}/job-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit application');
    }
    
    return await response.json();
  },
  
  // sales inquiries endpoint
  async submitSalesInquiry(inquiryData) {
    const response = await fetch(`${this.baseUrl}/sales-inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit inquiry');
    }
    
    return await response.json();
  },
  
  // admin endpoints
  async getAllOrders() {
    const response = await fetch(`${this.baseUrl}/admin/orders`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to load orders');
    }
    
    return await response.json();
  },
  
  async getAllApplications() {
    const response = await fetch(`${this.baseUrl}/admin/job-applications`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to load applications');
    }
    
    return await response.json();
  },
  
  async getAllInquiries() {
    const response = await fetch(`${this.baseUrl}/admin/sales-inquiries`, {
      headers: auth.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to load inquiries');
    }
    
    return await response.json();
  }
};
