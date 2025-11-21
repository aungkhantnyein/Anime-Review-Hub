// Rating System for Anime Vision - Complete Version
console.log('Rating System loading...');

class RatingSystem {
    constructor() {
        this.currentAnimeId = null;
        this.currentRating = 0;
        this.initializeRatingSystem();
    }

    // Initialize rating system
    initializeRatingSystem() {
        console.log('Initializing rating system...');
        this.createRatingModal();
        this.setupEventListeners();
    }

    // Create rating modal HTML
    createRatingModal() {
        // Check if modal already exists
        if (document.getElementById('ratingModal')) {
            console.log('Rating modal already exists');
            return;
        }

        // Create rating modal
        const ratingModal = document.createElement('div');
        ratingModal.className = 'modal-overlay';
        ratingModal.id = 'ratingModal';
        ratingModal.style.display = 'none';
        
        ratingModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Rate this Anime</h2>
                    <button class="close-btn" onclick="ratingSystem.closeRatingModal()">×</button>
                </div>
                <div class="rating-container">
                    <div class="current-anime-info" id="currentAnimeInfo">
                        <!-- Anime info will be loaded here -->
                    </div>
                    <div class="rating-stars" id="ratingStars">
                        ${this.generateStars(10)}
                    </div>
                    <div class="rating-value" id="ratingValue">Select rating: 0/10</div>
                    <div class="rating-actions">
                        <button class="btn btn-primary" onclick="ratingSystem.submitRating()">Submit Rating</button>
                        <button class="btn btn-secondary" onclick="ratingSystem.closeRatingModal()">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(ratingModal);
        console.log('Rating modal created');
    }

    // Generate star HTML
    generateStars(count) {
        let stars = '';
        for (let i = 1; i <= count; i++) {
            stars += `
                <span class="star" data-rating="${i}" 
                      onclick="ratingSystem.setRating(${i})"
                      onmouseover="ratingSystem.highlightStars(${i})"
                      onmouseout="ratingSystem.resetStars()">
                    ★
                </span>
            `;
        }
        return stars;
    }

    // Setup event listeners
    setupEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('ratingModal');
            if (e.target === modal) {
                this.closeRatingModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeRatingModal();
            }
        });
    }

    // Handle rate button click
    handleRateClick(animeId) {
        console.log('Rate clicked for anime:', animeId);
        
        // Check if user is logged in
        if (!userManager || !userManager.isLoggedIn()) {
            alert('Please login to rate anime');
            if (userManager) {
                userManager.showLoginForm();
            }
            return;
        }

        this.currentAnimeId = animeId;
        this.currentRating = userManager.getUserRating(animeId) || 0;
        
        // Load anime info for the modal
        this.loadAnimeInfo(animeId);
        this.showRatingModal();
        this.updateStarsDisplay();
    }

    // Load anime info for modal
    loadAnimeInfo(animeId) {
        const animeInfoElement = document.getElementById('currentAnimeInfo');
        if (!animeInfoElement) return;

        const animes = animeManager ? animeManager.getAllAnimes() : [];
        const anime = animes.find(a => a.id == animeId);
        
        if (anime) {
            animeInfoElement.innerHTML = `
                <div class="anime-modal-info">
                    <div class="anime-modal-title">${anime.title}</div>
                    ${anime.image && anime.image !== "default.jpg" ? 
                        `<img src="img/${anime.image}" alt="${anime.title}" class="anime-modal-poster">` : 
                        '<div class="anime-modal-placeholder">No Image</div>'
                    }
                    <div class="anime-modal-rating">
                        <span>Current IMDb Rating: ${anime.rating}/10</span>
                    </div>
                </div>
            `;
        } else {
            animeInfoElement.innerHTML = '<div class="anime-modal-title">Anime Information</div>';
        }
    }

    // Show rating modal
    showRatingModal() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            modal.style.display = 'flex';
            this.updateStarsDisplay();
            
            // Focus on modal for accessibility
            setTimeout(() => {
                const firstStar = document.querySelector('.star');
                if (firstStar) {
                    firstStar.focus();
                }
            }, 100);
        }
    }

    // Close rating modal
    closeRatingModal() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            modal.style.display = 'none';
            this.currentRating = 0;
            this.currentAnimeId = null;
        }
    }

    // Set rating
    setRating(rating) {
        this.currentRating = rating;
        this.updateStarsDisplay();
    }

    // Highlight stars on hover
    highlightStars(rating) {
        const stars = document.querySelectorAll('#ratingStars .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
        
        this.updateRatingText(rating);
    }

    // Reset stars after hover
    resetStars() {
        this.highlightStars(this.currentRating);
    }

    // Update rating text
    updateRatingText(rating) {
        const ratingValue = document.getElementById('ratingValue');
        if (ratingValue) {
            let text = `Select rating: ${rating}/10`;
            if (rating === 10) text = 'Perfect! 10/10';
            else if (rating >= 8) text = `Excellent! ${rating}/10`;
            else if (rating >= 6) text = `Good! ${rating}/10`;
            else if (rating >= 4) text = `Average ${rating}/10`;
            else if (rating >= 1) text = `Poor ${rating}/10`;
            
            ratingValue.textContent = text;
        }
    }

    // Update stars display
    updateStarsDisplay() {
        const stars = document.querySelectorAll('#ratingStars .star');
        stars.forEach((star, index) => {
            star.classList.remove('active', 'hover');
            if (index < this.currentRating) {
                star.classList.add('active');
            }
        });
        
        this.updateRatingText(this.currentRating);
    }

    // Submit rating
    submitRating() {
        if (!this.currentAnimeId || this.currentRating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!userManager || !userManager.isLoggedIn()) {
            alert('Please login to submit rating');
            return;
        }

        // Save rating
        const result = userManager.addRating(this.currentAnimeId, this.currentRating);
        
        if (result.success) {
            alert(`Rating submitted successfully: ${this.currentRating}/10`);
            this.closeRatingModal();
            
            // Refresh ratings display
            if (typeof refreshRatings === 'function') {
                refreshRatings();
            }
            
            // Also refresh anime display if function exists
            if (typeof loadAnimeData === 'function') {
                setTimeout(() => loadAnimeData(), 100);
            }
        } else {
            alert(result.message);
        }
    }

    // Get display rating for anime (for showing in UI)
    getDisplayRating(animeId) {
        if (!userManager || !userManager.isLoggedIn()) {
            return null;
        }
        return userManager.getUserRating(animeId);
    }

    // Remove rating (optional feature)
    removeRating(animeId) {
        if (!userManager || !userManager.isLoggedIn()) {
            return { success: false, message: 'Please login to remove rating' };
        }

        try {
            delete userManager.users[userManager.currentUser].ratings[animeId];
            
            if (userManager.saveUsers()) {
                // Refresh display
                if (typeof refreshRatings === 'function') {
                    refreshRatings();
                }
                return { success: true, message: 'Rating removed successfully' };
            } else {
                return { success: false, message: 'Error removing rating' };
            }
        } catch (error) {
            console.error('Error removing rating:', error);
            return { success: false, message: 'Error removing rating' };
        }
    }
}

// Create global instance
console.log('Creating ratingSystem instance...');
const ratingSystem = new RatingSystem();

// Global functions for HTML onclick
function handleRateClick(animeId) {
    if (ratingSystem) {
        ratingSystem.handleRateClick(animeId);
    } else {
        console.error('Rating system not available');
        alert('Rating system is not ready. Please refresh the page.');
    }
}

function closeRatingModal() {
    if (ratingSystem) {
        ratingSystem.closeRatingModal();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Rating system ready');
});

console.log('Rating System loaded completely');