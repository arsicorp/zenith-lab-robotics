// api configuration
const config = {
    baseUrl: 'http://localhost:8080',

    // helper to get auth token
    getToken() {
        return localStorage.getItem('token');
    },

    // helper to get auth headers
    getHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    },

    // get current user info from token
    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            // decode jwt token (simple base64 decode)
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    }
};
