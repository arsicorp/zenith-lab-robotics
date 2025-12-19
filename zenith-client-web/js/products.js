// products listing page logic
// handles filters, search, comparison selection

// state management
let allProducts = [];
let selectedForComparison = [];
let compareMode = false;

// load everything on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();

    // check if category filter in url
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    if (categoryId) {
        // apply category filter after products load
        setTimeout(() => {
            document.querySelector(`input[value="${categoryId}"]`).checked = true;
            applyFilters();
        }, 500);
    }
});

// load categories for filter sidebar
async function loadCategories() {
    try {
        const response = await axios.get(`${config.baseUrl}/categories`);
        const categories = response.data;

        const container = document.getElementById('category-filters');

        categories.forEach(category => {
            const checkbox = document.createElement('div');
            checkbox.className = 'filter-checkbox';
            checkbox.innerHTML = `
                <input type="checkbox" id="cat-${category.categoryId}" value="${category.categoryId}">
                <label for="cat-${category.categoryId}">${category.name}</label>
            `;
            container.appendChild(checkbox);
        });

    } catch (error) {
        console.log('failed to load categories:', error);
    }
}

// load all products
async function loadProducts() {
    try {
        const response = await axios.get(`${config.baseUrl}/products`);
        allProducts = response.data;
        displayProducts(allProducts);

    } catch (error) {
        console.log('failed to load products:', error);
    }
}

// display products in grid
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    // update count
    document.getElementById('product-count').textContent = products.length;

    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.color = getRobotColor(product.name);
    card.dataset.productId = product.productId;

    // check if in comparison selection
    const isSelected = selectedForComparison.includes(product.productId);

    card.innerHTML = `
        ${compareMode ? `
            <div class="compare-checkbox">
                <input type="checkbox"
                       id="compare-${product.productId}"
                       ${isSelected ? 'checked' : ''}
                       onchange="toggleCompareSelection(${product.productId})">
                <label for="compare-${product.productId}">Compare</label>
            </div>
        ` : ''}

        <div class="product-image">
            <img src="images/products/${product.imageUrl}" alt="${product.name}">
        </div>

        <div class="product-info">
            <h3 class="product-name">${product.name.toUpperCase()}</h3>
            <p class="product-price">$${product.price.toLocaleString()}</p>
            <p class="product-color">${product.color}</p>
            <p class="product-description">${product.description.substring(0, 100)}...</p>
            <a href="product-detail.html?id=${product.productId}" class="btn btn-primary">View Details</a>
        </div>
    `;

    return card;
}

// get robot color for border
function getRobotColor(name) {
    if (name.includes('KODA')) return 'koda';
    if (name.includes('SERVO')) return 'servo';
    if (name.includes('NOVA')) return 'nova';
    if (name.includes('MAGMA')) return 'magma';
    if (name.includes('EPSI')) return 'epsi9';
    if (name.includes('SAGE')) return 'sage';
    return 'default';
}

// apply filters
function applyFilters() {
    // get selected categories
    const selectedCategories = Array.from(
        document.querySelectorAll('#category-filters input:checked')
    ).map(checkbox => parseInt(checkbox.value));

    // get price range
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    // get color
    const color = document.getElementById('color-filter').value;

    // filter products
    let filtered = allProducts;

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.categoryId));
    }

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (color) {
        filtered = filtered.filter(p => p.color === color);
    }

    displayProducts(filtered);
}

// clear all filters
function clearFilters() {
    // uncheck all category checkboxes
    document.querySelectorAll('#category-filters input').forEach(checkbox => {
        checkbox.checked = false;
    });

    // clear price inputs
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';

    // reset color dropdown
    document.getElementById('color-filter').value = '';

    // show all products
    displayProducts(allProducts);
}

// toggle compare mode
function toggleCompareMode() {
    compareMode = !compareMode;

    if (compareMode) {
        document.getElementById('compare-bar').style.display = 'flex';
    } else {
        document.getElementById('compare-bar').style.display = 'none';
    }

    // reload products to show/hide checkboxes
    displayProducts(allProducts);
}

// toggle product in comparison selection
function toggleCompareSelection(productId) {
    const index = selectedForComparison.indexOf(productId);

    if (index > -1) {
        // remove from selection
        selectedForComparison.splice(index, 1);
    } else {
        // add to selection (max 3)
        if (selectedForComparison.length < 3) {
            selectedForComparison.push(productId);
        } else {
            alert('You can only compare up to 3 products at once');
            // uncheck the checkbox
            document.getElementById(`compare-${productId}`).checked = false;
            return;
        }
    }

    // update compare bar
    document.getElementById('compare-count').textContent =
        `${selectedForComparison.length} / 3 selected`;
}

// view comparison
function viewComparison() {
    if (selectedForComparison.length < 2) {
        alert('Please select at least 2 products to compare');
        return;
    }

    // redirect to compare page with selected ids
    const ids = selectedForComparison.join(',');
    window.location.href = `compare.html?ids=${ids}`;
}

// clear comparison
function clearComparison() {
    selectedForComparison = [];
    document.getElementById('compare-count').textContent = '0 / 3 selected';

    // uncheck all checkboxes
    document.querySelectorAll('.compare-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
}
