// user_manager.js
// Complete User Manager with Rating System

class UserManager {
    constructor() {
        
        this.currentUser = null;
        this.users = this.loadUsers();
        this.setupEventListeners();
        this.initializeUser();
    }

    loadUsers() {
        try {
            const saved = localStorage.getItem('animeUsers');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            
            return {};
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('animeUsers', JSON.stringify(this.users));
            return true;
        } catch (error) {
           
            return false;
        }
    }

    initializeUser() {
        // Check if user was logged in previously
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && this.users[savedUser]) {
            this.currentUser = savedUser;
            
        }
        this.updateUI();
    }

    setupEventListeners() {
       

        document.addEventListener('click', (e) => {
            if (e.target.closest('#loginForm button[type="submit"]')) {
                e.preventDefault();
                this.handleLogin();
            }
            if (e.target.closest('#registerForm button[type="submit"]')) {
                e.preventDefault();
                this.handleRegister();
            }
        });

        this.bindFormsDirectly();
    }

    bindFormsDirectly() {
        
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
           
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin();
            };
        }

        if (registerForm) {
           
            registerForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleRegister();
            };
        }
    }

    handleLogin() {
        
        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }

        const user = this.users[username];
        if (user && user.password === password) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            this.closeLoginModal();
            this.updateUI();
            alert('Login successful!');

            // Refresh anime display to show user ratings
            if (typeof loadAnimeData === 'function') {
                setTimeout(() => loadAnimeData(), 100);
            }
        } else {
            alert('Invalid username or password');
        }
    }

    handleRegister() {
        
        const username = document.getElementById('registerUsername')?.value.trim();
        const password = document.getElementById('registerPassword')?.value;

        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }

        if (username.length < 3) {
            alert('Username must be at least 3 characters long');
            return;
        }

        if (password.length < 4) {
            alert('Password must be at least 4 characters long');
            return;
        }

        if (this.users[username]) {
            alert('Username already exists');
            return;
        }

        // Create new user with ratings object
        this.users[username] = {
            password: password,
            ratings: {},
            favorites: [],
            createdAt: new Date().toISOString()
        };

        if (this.saveUsers()) {
            this.closeRegisterModal();
            alert('Registration successful! You can now login.');

            // Clear form
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
        } else {
            alert('Error saving user data');
        }
    }

    // Rating System Methods
    addRating(animeId, rating) {
        if (!this.isLoggedIn()) {
            return { success: false, message: 'Please login to rate anime' };
        }

        if (!animeId || rating < 1 || rating > 10) {
            return { success: false, message: 'Invalid rating. Please select between 1-10' };
        }

        try {
            // Save rating to user data
            this.users[this.currentUser].ratings[animeId] = rating;

            if (this.saveUsers()) {
                
                return {
                    success: true,
                    message: `Rating submitted: ${rating}/10`
                };
            } else {
                return { success: false, message: 'Error saving rating' };
            }
        } catch (error) {
            
            return { success: false, message: 'Error saving rating' };
        }
    }

    getUserRating(animeId) {
        if (!this.isLoggedIn() || !this.users[this.currentUser].ratings) {
            return null;
        }
        return this.users[this.currentUser].ratings[animeId] || null;
    }

    getAllUserRatings() {
        if (!this.isLoggedIn()) {
            return {};
        }
        return this.users[this.currentUser].ratings || {};
    }

    // UI Methods
    showLoginForm() {
       
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
            // Clear form
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        }
    }

    showRegisterForm() {
       
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    closeRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    updateUI() {
        
        const userAuth = document.getElementById('userAuth');
        const userProfile = document.getElementById('userProfile');
        const usernameDisplay = document.getElementById('usernameDisplay');

        if (userAuth && userProfile && usernameDisplay) {
            if (this.isLoggedIn()) {
                userAuth.style.display = 'none';
                userProfile.style.display = 'flex';
                usernameDisplay.textContent = this.currentUser;
                
            } else {
                userAuth.style.display = 'flex';
                userProfile.style.display = 'none';
               
            }
        } else {
           
        }
    }

    isLoggedIn() {
        return this.currentUser !== null && this.users[this.currentUser] !== undefined;
    }

    logout() {
       
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        alert('Logged out successfully');

        // Refresh anime display to remove user ratings
        if (typeof loadAnimeData === 'function') {
            setTimeout(() => loadAnimeData(), 100);
        }
    }
}

// Create global instance

const userManager = new UserManager();

// Global functions for HTML onclick
function showLoginForm() {
    userManager.showLoginForm();
}

function showRegisterForm() {
    userManager.showRegisterForm();
}

function closeLoginModal() {
    userManager.closeLoginModal();
}

function closeRegisterModal() {
    userManager.closeRegisterModal();
}

function logout() {
    userManager.logout();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        userManager.updateUI();
        // Load anime data if function exists
        if (typeof loadAnimeData === 'function') {
            setTimeout(() => loadAnimeData(), 200);
        }
    }, 100);
});