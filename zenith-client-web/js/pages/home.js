// homepage logic - featured robots, hero section

const home = {
  // initialize homepage
  async init() {
    await this.loadFeaturedRobots();
  },
  
  // load and display featured robots (6 main robots)
  async loadFeaturedRobots() {
    const container = document.getElementById('robots-grid');
    if (!container) return;
    
    try {
      // show loading skeletons
      utils.showSkeletons('robots-grid', 6);
      
      // get all products
      const products = await api.getProducts();
      
      // filter for featured robots only (category 1-6, not accessories)
      const robots = products.filter(p => 
        p.categoryId >= 1 && p.categoryId <= 6 && p.featured
      );
      
      // display robots
      this.displayRobots(robots);
      
    } catch (error) {
      container.innerHTML = `
        <div class="error-message" style="grid-column: 1 / -1;">
          Failed to load robots. <button onclick="home.loadFeaturedRobots()" class="btn btn-small btn-primary">Try Again</button>
        </div>
      `;
    }
  },
  
  // display robots in grid
  displayRobots(robots) {
    const container = document.getElementById('robots-grid');
    if (!container) return;
    
    if (robots.length === 0) {
      container.innerHTML = '<p>No robots available.</p>';
      return;
    }
    
    container.innerHTML = robots.map(robot => {
      const robotClass = robot.name.split(' ')[0].toLowerCase();
      const buyerText = utils.getBuyerRequirementText(robot.buyerRequirement);
      
      return `
        <div class="product-card robot-card ${robotClass}" onclick="window.location.href='product-detail.html?id=${robot.productId}'">
          <div class="product-card-image" style="background: ${utils.getRobotGradient(robot.name)}">
            ${buyerText ? `<span class="product-badge restricted">${buyerText}</span>` : ''}
          </div>
          <div class="product-card-content">
            <h3 class="product-card-title">${robot.name}</h3>
            <p class="product-card-desc">${utils.truncate(robot.description, 100)}</p>
            <div class="product-card-price">${utils.formatPrice(robot.price)}</div>
            <div class="product-card-footer">
              <button class="btn btn-primary btn-full">View Details</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  home.init();
});
