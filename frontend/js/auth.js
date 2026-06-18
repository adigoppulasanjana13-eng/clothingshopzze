// Authentication state and action manager
const Auth = {
  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('bloom_token');
  },

  // Get current user data
  getUser() {
    const userStr = localStorage.getItem('bloom_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  // Save authentication details
  saveSession(token, user) {
    localStorage.setItem('bloom_token', token);
    localStorage.setItem('bloom_user', JSON.stringify(user));
  },

  // Clear authentication details
  clearSession() {
    localStorage.removeItem('bloom_token');
    localStorage.removeItem('bloom_user');
    localStorage.removeItem('bloom_cart_count');
  },

  // Log in action
  async login(email, password) {
    try {
      const response = await window.API.post('/auth/login', { email, password });
      if (response.success && response.data) {
        this.saveSession(response.data.token, response.data);
        window.API.showToast(`Welcome back, ${response.data.name}!`);
        
        // Redirect to profile or shop after a tiny delay
        setTimeout(() => {
          window.location.href = response.data.role === 'admin' ? '/admin.html' : '/profile.html';
        }, 1000);
      }
    } catch (err) {
      // API handler already toasts errors
    }
  },

  // Register action
  async register(name, email, password, phone, dob, gender) {
    try {
      const response = await window.API.post('/auth/register', {
        name,
        email,
        password,
        phone,
        dateOfBirth: dob,
        gender
      });

      if (response.success && response.data) {
        this.saveSession(response.data.token, response.data);
        window.API.showToast('Registration successful! Welcome to BLUSH & BLOOM.');
        
        setTimeout(() => {
          window.location.href = '/profile.html';
        }, 1000);
      }
    } catch (err) {
      // API handler already toasts errors
    }
  },

  // Log out action
  logout() {
    this.clearSession();
    window.API.showToast('Logged out successfully.');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
  },

  // Fetch updated user details from server
  async fetchProfile() {
    if (!this.isLoggedIn()) return null;
    try {
      const response = await window.API.get('/auth/me');
      if (response.success) {
        localStorage.setItem('bloom_user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      // Token probably invalid
      this.clearSession();
      return null;
    }
  },

  // Initialize navigation elements based on auth state
  updateNavigation() {
    const user = this.getUser();
    const navActions = document.getElementById('nav-auth-actions');
    if (!navActions) return;

    if (this.isLoggedIn() && user) {
      let adminLink = '';
      if (user.role === 'admin') {
        adminLink = `<li><a class="nav-link" href="/admin.html" style="color: var(--accent-burgundy); font-weight: 700;">Admin</a></li>`;
      }
      
      // Update primary links to include admin if needed
      const mainNav = document.querySelector('.nav-links');
      if (mainNav && user.role === 'admin' && !mainNav.querySelector('a[href="/admin.html"]')) {
        mainNav.insertAdjacentHTML('beforeend', adminLink);
      }

      navActions.innerHTML = `
        <a href="/profile.html" class="nav-btn" title="My Profile"><i class="far fa-user"></i></a>
        <a href="/cart.html" class="nav-btn" title="Shopping Cart">
          <i class="fas fa-shopping-bag"></i>
          <span class="badge" id="cart-badge">0</span>
        </a>
        <button id="logout-btn" class="nav-btn" title="Logout" style="font-size: 1rem;"><i class="fas fa-sign-out-alt"></i></button>
      `;

      // Wire logout click
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.logout());
      }
      
      this.updateCartBadgeCount();
    } else {
      navActions.innerHTML = `
        <a href="/login.html" class="nav-btn" title="Login"><i class="far fa-user"></i></a>
        <a href="/login.html" class="nav-btn" title="Shopping Cart">
          <i class="fas fa-shopping-bag"></i>
        </a>
      `;
    }
  },

  // Sync cart badge count with backend
  async updateCartBadgeCount() {
    if (!this.isLoggedIn()) return;
    try {
      const response = await window.API.get('/cart');
      if (response.success && response.data) {
        const items = response.data.items || [];
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        
        const badge = document.getElementById('cart-badge');
        if (badge) {
          badge.textContent = count;
          badge.style.display = count > 0 ? 'flex' : 'none';
        }
        localStorage.setItem('bloom_cart_count', count);
      }
    } catch (err) {
      console.error('Failed to update cart badge count:', err);
    }
  }
};

// Auto run when script loads
document.addEventListener('DOMContentLoaded', () => {
  Auth.updateNavigation();
});

window.Auth = Auth;
