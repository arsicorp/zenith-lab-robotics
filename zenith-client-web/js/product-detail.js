// product detail page logic
// loads single product, handles add to cart, shows buyer restrictions

let currentProduct = null;

// load product on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('Product not found');
        window.location.href = 'products.html';
        return;
    }

    loadProduct(productId);
});

// load product details
async function loadProduct(productId) {
    try {
        const response = await axios.get(`${config.baseUrl}/products/${productId}`);
        currentProduct = response.data;

        displayProduct(currentProduct);
        displaySpecifications(currentProduct);

        // load accessories if this is a robot (not accessory)
        if (currentProduct.categoryId !== 7) {
            loadCompatibleAccessories(currentProduct.productId);
        }

    } catch (error) {
        console.log('failed to load product:', error);
        alert('Product not found');
        window.location.href = 'products.html';
    }
}

// display product main section
function displayProduct(product) {
    const container = document.getElementById('product-detail');

    // check buyer restriction if user is logged in
    const userProfile = config.isLoggedIn() ? getUserProfile() : null;
    const restrictionWarning = checkBuyerRestriction(product, userProfile);

    const color = getRobotColor(product.name);

    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                <img src="images/products/${product.imageUrl}" alt="${product.name}">
            </div>

            <div class="product-detail-info" data-color="${color}">
                <h1>${product.name.toUpperCase()}</h1>
                <p class="detail-price">$${product.price.toLocaleString()}</p>
                <p class="detail-color">${product.color}</p>

                ${restrictionWarning ? `
                    <div class="buyer-warning">
                        <strong>⚠️ ${restrictionWarning.title}</strong>
                        <p>${restrictionWarning.message}</p>
                    </div>
                ` : ''}

                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                    <span class="stock-info">${product.stock} in stock</span>
                </div>

                <button onclick="addToCart()" class="btn btn-primary btn-large">
                    Add to Cart
                </button>

                <div class="product-description">
                    <h3>About This Robot</h3>
                    <p>${product.description}</p>
                </div>

                ${product.useCases ? `
                    <div class="use-cases">
                        <h3>Use Cases</h3>
                        <div class="use-case-tags">
                            ${product.useCases.split(',').map(useCase =>
                                `<span class="tag">${useCase.trim()}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// check if user can buy this product
function checkBuyerRestriction(product, userProfile) {
    if (!config.isLoggedIn()) return null;
    if (!product.buyerRequirement || product.buyerRequirement === 'NONE') return null;

    // if we don't have profile data, can't check
    if (!userProfile) return null;

    const accountType = userProfile.accountType;
    const requirement = product.buyerRequirement;

    // check restrictions
    if (requirement === 'BUSINESS' && accountType !== 'BUSINESS') {
        return {
            title: 'BUSINESS ACCOUNT REQUIRED',
            message: 'Your PERSONAL account cannot purchase this robot. Please contact sales to upgrade your account.'
        };
    }

    if (requirement === 'MEDICAL' && accountType !== 'MEDICAL') {
        return {
            title: 'MEDICAL ACCOUNT REQUIRED',
            message: 'This robot requires a verified medical organization account. Please contact sales for more information.'
        };
    }

    if (requirement === 'GOVERNMENT' && accountType !== 'GOVERNMENT') {
        return {
            title: 'GOVERNMENT AUTHORIZATION REQUIRED',
            message: 'EPSI-9 is restricted to government agencies only. ITAR compliance required. Contact our defense sales team.'
        };
    }

    return null;
}

// get user profile (mock - would call api in real app)
function getUserProfile() {
    // in real app, would call GET /profile
    // for now, decode from token or return mock data
    const user = config.getCurrentUser();
    if (!user) return null;

    // this is simplified - in real app would fetch from api
    return {
        accountType: 'PERSONAL' // default
    };
}

// display specifications table
function displaySpecifications(product) {
    const container = document.getElementById('specifications');

    // check if this is a robot (has specs)
    if (!product.aiModel) {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = `
        <h2>TECHNICAL SPECIFICATIONS</h2>
        <table class="specs-table">
            <tr>
                <td class="spec-label">AI System</td>
                <td class="spec-value">${product.aiModel}</td>
            </tr>
            <tr>
                <td class="spec-label">Height</td>
                <td class="spec-value">${product.heightCm} cm</td>
            </tr>
            <tr>
                <td class="spec-label">Weight</td>
                <td class="spec-value">${product.weightKg} kg</td>
            </tr>
            <tr>
                <td class="spec-label">Payload Capacity</td>
                <td class="spec-value">${product.payloadKg} kg</td>
            </tr>
            <tr>
                <td class="spec-label">Battery Life</td>
                <td class="spec-value">${product.batteryHours} hours</td>
            </tr>
            <tr>
                <td class="spec-label">Max Speed</td>
                <td class="spec-value">${product.speedKmh} km/h</td>
            </tr>
            <tr>
                <td class="spec-label">Autonomy Level</td>
                <td class="spec-value">${product.autonomyLevel}</td>
            </tr>
            <tr>
                <td class="spec-label">Warranty</td>
                <td class="spec-value">${product.warrantyYears} years</td>
            </tr>
        </table>
    `;
}

// load compatible accessories
async function loadCompatibleAccessories(robotId) {
    try {
        // get all accessories
        const response = await axios.get(`${config.baseUrl}/products?cat=7`);
        const allAccessories = response.data;

        // filter accessories compatible with this robot
        const compatible = allAccessories.filter(accessory => {
            if (!accessory.compatibleRobots) return false;
            const compatibleIds = accessory.compatibleRobots.split(',').map(id => parseInt(id.trim()));
            return compatibleIds.includes(robotId);
        });

        if (compatible.length === 0) return;

        // show accessories section
        document.getElementById('accessories-section').style.display = 'block';

        const grid = document.getElementById('accessories-grid');
        compatible.forEach(accessory => {
            const card = createAccessoryCard(accessory);
            grid.appendChild(card);
        });

    } catch (error) {
        console.log('failed to load accessories:', error);
    }
}

// create accessory card
function createAccessoryCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image">
            <img src="images/products/${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toLocaleString()}</p>
            <p class="product-description">${product.description.substring(0, 80)}...</p>
            <a href="product-detail.html?id=${product.productId}" class="btn btn-primary">View Details</a>
        </div>
    `;

    return card;
}

// add to cart
async function addToCart() {
    if (!config.isLoggedIn()) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);

    if (quantity < 1 || quantity > currentProduct.stock) {
        alert('Invalid quantity');
        return;
    }

    try {
        await axios.post(
            `${config.baseUrl}/cart/products/${currentProduct.productId}`,
            { quantity: quantity },
            { headers: config.getHeaders() }
        );

        // success feedback
        const btn = document.querySelector('.btn-large');
        const originalText = btn.textContent;
        btn.textContent = '✓ Added to Cart!';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');

        // update cart badge
        updateCartBadge();

        // reset button after 2 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-primary');
        }, 2000);

    } catch (error) {
        console.log('failed to add to cart:', error);
        alert('Failed to add to cart. Please try again.');
    }
}

// get robot color
function getRobotColor(name) {
    if (name.includes('KODA')) return 'koda';
    if (name.includes('SERVO')) return 'servo';
    if (name.includes('NOVA')) return 'nova';
    if (name.includes('MAGMA')) return 'magma';
    if (name.includes('EPSI')) return 'epsi9';
    if (name.includes('SAGE')) return 'sage';
    return 'default';
}
