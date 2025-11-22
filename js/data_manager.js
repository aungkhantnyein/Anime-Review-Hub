// Simple Data Management System for Non-Coders
class AnimeDataManager {
    constructor() {
        this.animes = this.loadAnimes();
    }

    // Load animes from localStorage or use default
    loadAnimes() {
        const saved = localStorage.getItem('animeDatabase');
        if (saved) {
            const parsedAnimes = JSON.parse(saved);

            // ✅ FIXED: Auto-convert old string synopsis to object format
            // ✅ ADDED: Ensure songs array exists
            return parsedAnimes.map(anime => {
                let updatedAnime = { ...anime };

                // Convert synopsis if needed
                if (typeof anime.synopsis === 'string') {
                    updatedAnime.synopsis = {
                        en: anime.synopsis,
                        jp: anime.synopsis,
                        my: ""
                    };
                }

                // Ensure songs array exists
                if (!anime.songs) {
                    updatedAnime.songs = [];
                }

                return updatedAnime;
            });
        } else {
            // Default anime data with better structure
            return [
                {
                    id: 1,
                    title: "Attack on Titan",
                    rating: 9.2,
                    genres: ["Action", "Fantasy", "Drama"],
                    synopsis: {
                        en: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, giant humanoid creatures that devour humans, the story follows Eren Yeager and his friends.",
                        jp: "巨大な城壁に囲まれた世界で人類が巨人から逃れて生きる物語。主人公エレン・イェーガーとその友人ミカサ、アルミンたちの戦いを描く。",
                        my: ""
                    },
                    image: "attack-on-titan.jpg",
                    characters: [
                        { name: "Eren Yeager", role: "Main Protagonist" },
                        { name: "Mikasa Ackerman", role: "Main Heroine" },
                        { name: "Armin Arlert", role: "Strategic Genius" }
                    ],
                    songs: [
                        { title: "Guren no Yumiya", youtubeId: "XMXgHfHxKVM" },
                        { title: "Shinzo wo Sasageyo", youtubeId: "LKP-gEoAX30" },
                        { title: "Red Swan", youtubeId: "6Dxd7WOa2eI" },
                        { title: "My War", youtubeId: "Hl5X4WG4Dc8" }
                    ],
                    userRating: 0
                },
                {
                    id: 2,
                    title: "Demon Slayer",
                    rating: 8.7,
                    genres: ["Action", "Supernatural", "Adventure"],
                    synopsis: {
                        en: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.",
                        jp: "鬼に家族を殺された少年・竈門炭治郎が、鬼となった妹・禰豆子を人間に戻すため、鬼狩り隊として戦う姿を描く。",
                        my: ""
                    },
                    image: "demon-slayer.jpg",
                    characters: [
                        { name: "Tanjiro Kamado", role: "Main Protagonist" },
                        { name: "Nezuko Kamado", role: "Demon Sister" },
                        { name: "Zenitsu Agatsuma", role: "Thunder Breath User" }
                    ],
                    songs: [
                        { title: "Gurenge", youtubeId: "92B1q7yAbkY" },
                        { title: "Kamado Tanjiro no Uta", youtubeId: "6WlS4Lvl3YQ" },
                        { title: "Homura", youtubeId: "6WlS4Lvl3YQ" },
                        { title: "Zankyou Sanka", youtubeId: "vVDr6Fp5b8o" }
                    ],
                    userRating: 0
                }
            ];
        }
    }

    // Save animes to localStorage
    saveAnimes() {
        localStorage.setItem('animeDatabase', JSON.stringify(this.animes));
    }

    // Add new anime (simple method for non-coders)
    addNewAnime(title, synopsis_en, synopsis_jp, synopsis_my, rating, characterNames, characterRoles, imageFile, genreText) {
        // ✅ FIXED: Better error handling for parameters
        if (!title || !synopsis_en || !rating || !characterNames) {
            throw new Error('All required fields must be filled');
        }

        const newAnime = {
            id: Date.now(),
            title: title.trim(),
            synopsis: {
                en: (synopsis_en || "").trim(),
                jp: (synopsis_jp || synopsis_en + " (Japanese version)").trim(),
                my: (synopsis_my || "").trim()
            },
            rating: parseFloat(rating),
            image: (imageFile || "default.jpg").trim(),
            characters: this.createCharacters(characterNames, characterRoles),
            genres: this.processGenres(genreText),
            songs: [], // ✅ ADDED: Empty songs array for new anime
            userRating: 0
        };

        // ✅ FIXED: Validate rating range
        if (newAnime.rating < 1 || newAnime.rating > 10) {
            throw new Error('Rating must be between 1 and 10');
        }

        this.animes.push(newAnime);
        this.saveAnimes();
        return newAnime;
    }

    // Create characters array from names and roles
    createCharacters(names, roles) {
        // ✅ FIXED: Better character creation with validation
        if (!names || typeof names !== 'string') {
            return [];
        }

        const nameArray = names.split(',').map(name => name.trim()).filter(name => name.length > 0);

        if (nameArray.length === 0) {
            return [];
        }

        const roleArray = typeof roles === 'string' ?
            roles.split(',').map(role => role.trim()) :
            [];

        return nameArray.map((name, index) => ({
            name: name,
            role: roleArray[index] || roles
        }));
    }

    // Genre processing function
    processGenres(genreText) {
        if (!genreText) return [];

        const genres = genreText.split(',')
            .map(genre => genre.trim())
            .filter(genre => genre.length > 0)
            .slice(0, 3); // Maximum 3 genres

        return genres;
    }

    // Get all animes
    getAllAnimes() {
        return this.animes;
    }

    // Get anime by ID
    getAnimeById(id) {
        return this.animes.find(anime => anime.id === id);
    }

    // Update existing anime
    updateAnime(animeId, updatedData) {
        const animeIndex = this.animes.findIndex(anime => anime.id === animeId);

        if (animeIndex !== -1) {
            this.animes[animeIndex] = {
                ...this.animes[animeIndex],
                ...updatedData
            };
            this.saveAnimes();
            return true;
        }
        return false;
    }

    // Delete anime
    deleteAnime(animeId) {
        const initialLength = this.animes.length;
        this.animes = this.animes.filter(anime => anime.id !== animeId);

        if (this.animes.length < initialLength) {
            this.saveAnimes();
            return true;
        }
        return false;
    }

    // Export data (for backup)
    exportData() {
        const dataStr = JSON.stringify(this.animes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        return URL.createObjectURL(dataBlob);
    }

    // Import data (from backup)
    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);

            // ✅ FIXED: Validate imported data structure
            if (!Array.isArray(imported)) {
                throw new Error('Invalid data format');
            }

            this.animes = imported;
            this.saveAnimes();
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }

    // ✅ NEW: Search animes
    searchAnimes(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return this.animes;

        return this.animes.filter(anime =>
            anime.title.toLowerCase().includes(searchTerm) ||
            (typeof anime.synopsis === 'object' ?
                anime.synopsis.en.toLowerCase().includes(searchTerm) :
                anime.synopsis.toLowerCase().includes(searchTerm)) ||
            anime.characters.some(char =>
                char.name.toLowerCase().includes(searchTerm)
            )
        );
    }

    // ✅ NEW: Get total anime count
    getTotalAnimeCount() {
        return this.animes.length;
    }

    // ✅ NEW: Clear all data (for testing)
    clearAllData() {
        this.animes = [];
        this.saveAnimes();
    }
}

// Global instance
const animeManager = new AnimeDataManager(); 