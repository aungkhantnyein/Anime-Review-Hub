// main.js - Simplified Anime Cards (Only Name, Genre, Community Rating)

// Wait for data-manager.js to load first
if (typeof animeManager === 'undefined') {
}

// Anime Data Management
const animeData = {
    get animes() {
        return animeManager ? animeManager.getAllAnimes() : [];
    }
};

function createAnimeCardHTML(anime) {
    return `
    <div class="anime-card" onclick="openAnimeCard(${anime.id})">
        <div class="anime-image">
            ${anime.image && anime.image !== "default.jpg" ?
            `<img src="img/${anime.image}" alt="${anime.title}" class="anime-poster" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` :
            ''
        }
            <div class="image-placeholder" style="${anime.image && anime.image !== 'default.jpg' ? 'display:none' : 'display:flex'}">
                ${anime.title}
            </div>
        </div>
        <div class="anime-info-simple">
            <div class="anime-title">${anime.title}</div>
            <div class="anime-genres">
                ${anime.genres && anime.genres.length > 0 ?
            anime.genres.slice(0, 2).map(genre => `<span class="genre-tag">${genre}</span>`).join('') :
            '<span class="genre-tag">No Genre</span>'
        }
                ${anime.genres && anime.genres.length > 2 ?
            `<span class="genre-tag">+${anime.genres.length - 2}</span>` :
            ''
        }
            </div>
            <div class="community-rating-simple">
                <span class="rating-stars-simple">★</span>
                <span class="rating-value-simple">${anime.rating}/10</span>
            </div>
        </div>
    </div>
    `;
}

// Initialize main page content
function initializeMainPage() {
    loadAnimeData();
    loadGenreTabs();
    setupSearchFunctionality();
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// Search function
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        loadAnimeData();
        return;
    }

    const filteredAnime = animeData.animes.filter(anime => {
        if (anime.title.toLowerCase().includes(searchTerm)) return true;

        if (anime.synopsis) {
            if (typeof anime.synopsis === 'object') {
                if (anime.synopsis.en && anime.synopsis.en.toLowerCase().includes(searchTerm)) return true;
                if (anime.synopsis.jp && anime.synopsis.jp.toLowerCase().includes(searchTerm)) return true;
            } else {
                if (anime.synopsis.toLowerCase().includes(searchTerm)) return true;
            }
        }

        if (anime.characters && anime.characters.some(char =>
            char.name.toLowerCase().includes(searchTerm)
        )) return true;

        if (anime.genres && anime.genres.some(genre =>
            genre.toLowerCase().includes(searchTerm)
        )) return true;

        return false;
    });

    displayFilteredAnimes(filteredAnime, `Search results for "${searchTerm}"`);
}

// Load anime data into grid (ONLY NAME, GENRE, COMMUNITY RATING)
function loadAnimeData() {
    const animeGrid = document.getElementById('animeGrid');
    const animes = animeData.animes;

    if (!animes || animes.length === 0) {
        animeGrid.innerHTML = '<div class="loading-text">No anime found.</div>';
        return;
    }

    animeGrid.innerHTML = animes.map(anime => {
        return `
        <div class="anime-card" onclick="openAnimeCard(${anime.id})">
            <div class="anime-image">
                ${anime.image && anime.image !== "default.jpg" ?
                `<img src="img/${anime.image}" alt="${anime.title}" class="anime-poster" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` :
                ''
            }
                <div class="image-placeholder" style="${anime.image && anime.image !== 'default.jpg' ? 'display:none' : 'display:flex'}">
                    ${anime.title}
                </div>
            </div>
            <div class="anime-info-simple">
                <div class="anime-title">${anime.title}</div>
                <div class="anime-genres">
                    ${anime.genres && anime.genres.length > 0 ?
                anime.genres.slice(0, 2).map(genre => `<span class="genre-tag">${genre}</span>`).join('') :
                '<span class="genre-tag">No Genre</span>'
            }
                    ${anime.genres && anime.genres.length > 2 ?
                `<span class="genre-tag">+${anime.genres.length - 2}</span>` :
                ''
            }
                </div>
                <div class="community-rating-simple">
                    <span class="rating-stars-simple">★</span>
                    <span class="rating-value-simple">${anime.rating}/10</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Load genre filter tabs
function loadGenreTabs() {
    const genreTabs = document.getElementById('genreTabs');
    const animes = animeData.animes;

    if (!genreTabs) {
        console.error('Genre tabs element not found');
        return;
    }

    const allGenres = [];
    animes.forEach(anime => {
        if (anime.genres) {
            anime.genres.forEach(genre => {
                if (!allGenres.includes(genre)) {
                    allGenres.push(genre);
                }
            });
        }
    });

    // Sort genres alphabetically
    allGenres.sort();

    const genreTabsHTML = allGenres.map(genre =>
        `<button class="genre-tab" data-genre="${genre}">${genre}</button>`
    ).join('');

    genreTabs.innerHTML = `<button class="genre-tab active" data-genre="all">All</button>${genreTabsHTML}`;

    // Add event listeners to genre tabs
    document.querySelectorAll('.genre-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.genre-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const selectedGenre = this.getAttribute('data-genre');
            filterAnimesByGenre(selectedGenre);
        });
    });
}

// Filter animes by genre
function filterAnimesByGenre(genre) {
    const animes = animeData.animes;

    if (genre === 'all') {
        loadAnimeData();
        return;
    }

    const filteredAnimes = animes.filter(anime =>
        anime.genres && anime.genres.includes(genre)
    );

    displayFilteredAnimes(filteredAnimes, `Genre: ${genre}`);
}

// Display filtered animes
function displayFilteredAnimes(filteredAnimes, title = '') {
    const animeGrid = document.getElementById('animeGrid');

    if (filteredAnimes.length === 0) {
        animeGrid.innerHTML = '<div class="loading-text">No anime found.</div>';
        return;
    }

    animeGrid.innerHTML = filteredAnimes.map(anime => createAnimeCardHTML(anime)).join('');
}

// Splash Screen Functions
function enterSite() {
    const splash = document.getElementById('splashScreen');
    const main = document.getElementById('mainContent');

    if (!splash || !main) {
        return;
    }

    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        splash.style.display = 'none';
        main.style.display = 'block';

        setTimeout(() => {
            main.style.opacity = '1';
        }, 50);

        sessionStorage.setItem('userEntered', 'true');
        initializeMainPage();
    }, 500);
}

// Check if user already entered in this session
function checkSessionEntry() {
    const userEntered = sessionStorage.getItem('userEntered');
    const splash = document.getElementById('splashScreen');
    const main = document.getElementById('mainContent');

    if (userEntered === 'true' && splash && main) {
        splash.style.display = 'none';
        main.style.display = 'block';
        main.style.opacity = '1';
        initializeMainPage();
    } else {
        splash.style.display = 'flex';
        main.style.display = 'none';
    }
}

// Check session entry on page load
document.addEventListener('DOMContentLoaded', function () {
    checkSessionEntry();

    // Additional initialization after a short delay to ensure all scripts are loaded
    setTimeout(() => {
        if (typeof userManager !== 'undefined') {
            userManager.updateUI();
        }
    }, 500);
});

// Open anime card in new page
function openAnimeCard(animeId) {
    localStorage.setItem('selectedAnimeId', animeId);
    window.location.href = 'anime_card.html';
}