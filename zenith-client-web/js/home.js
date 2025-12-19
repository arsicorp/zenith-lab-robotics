// homepage logic
// loads featured robots from api

// load featured robots on page load
document.addEventListener('DOMContentLoaded', loadFeaturedRobots);

async function loadFeaturedRobots() {
    try {
        const response = await axios.get(`${config.baseUrl}/products?featured=true`);
        const robots = response.data;

        // get the grid container
        const grid = document.getElementById('featured-robots');

        // create card for each robot
        robots.forEach(robot => {
            const card = createRobotCard(robot);
            grid.appendChild(card);
        });

    } catch (error) {
        console.log('failed to load robots:', error);
    }
}

// create product card html
function createRobotCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.color = getRobotColor(product.name);

    card.innerHTML = `
        <div class="product-image">
            <img src="images/products/${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name.toUpperCase()}</h3>
            <p class="product-price">$${product.price.toLocaleString()}</p>
            <p class="product-description">${product.description.substring(0, 100)}...</p>
            <a href="product-detail.html?id=${product.productId}" class="btn btn-primary">View Details</a>
        </div>
    `;

    return card;
}

// get robot signature color based on name
function getRobotColor(name) {
    if (name.includes('KODA')) return 'koda';
    if (name.includes('SERVO')) return 'servo';
    if (name.includes('NOVA')) return 'nova';
    if (name.includes('MAGMA')) return 'magma';
    if (name.includes('EPSI')) return 'epsi9';
    if (name.includes('SAGE')) return 'sage';
    return 'default';
}
