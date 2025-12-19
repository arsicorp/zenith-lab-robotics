// navigation bar logic
// handles sticky nav, cart count, login state

// update cart badge count
function updateCartBadge() {
    if (!config.isLoggedIn()) {
        document.querySelector('.cart-badge').textContent = '0';
        return;
    }

    // get cart from api
    axios.get(`${config.baseUrl}/cart`, {
        headers: config.getHeaders()
    })
    .then(response => {
        const items = response.data.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-badge').textContent = totalItems;
    })
    .catch(err => {
        console.log('failed to load cart count:', err);
        document.querySelector('.cart-badge').textContent = '0';
    });
}

// update account button based on login state
function updateAccountButton() {
    const accountBtn = document.querySelector('.account-btn');

    if (config.isLoggedIn()) {
        const user = config.getCurrentUser();
        accountBtn.innerHTML = `
            <span>${user.sub || 'Account'}</span>
            <div class="dropdown">
                <a href="profile.html">Profile</a>
                <a href="profile.html#orders">Orders</a>
                <a href="#" onclick="logout()">Logout</a>
            </div>
        `;
    } else {
        accountBtn.innerHTML = '<a href="login.html">Login</a>';
    }
}

// logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// make nav sticky on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateAccountButton();
});
