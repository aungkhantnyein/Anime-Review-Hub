// // Anime Details Functions
// function showAnimeDetails(animeId) {
//     const anime = animeData.animes.find(a => a.id === animeId);
//     if (!anime) return;

//     // Hide main page, show details page
//     document.querySelector('.main-container').style.display = 'none';
//     document.getElementById('animeDetailsSection').style.display = 'block';

//     // Load anime details
//     document.getElementById('animeDetails').innerHTML = `
//         <div class="details-header">
//             <div class="details-poster">
//                 ${anime.title} Poster
//             </div>
//             <div class="details-info">
//                 <h1 class="details-title">${anime.title}</h1>
//                 <div class="details-rating">✩ ${anime.rating}/10 - Community Rating</div>
//                 <div class="details-synopsis">${anime.synopsis}</div>
                
//                 <div class="details-rating-system">
//                     <div class="rating-selector">
//                         <label><strong>Your Rating:</strong></label>
//                         <select class="rating-dropdown" onchange="rateAnime(${anime.id}, this.value)" ${anime.userRating > 0 ? 'disabled' : ''}>
//                             <option value="0">Select Rating (1-10)</option>
//                             ${Array.from({length: 10}, (_, i) => i + 1).map(num => 
//                                 `<option value="${num}" ${anime.userRating === num ? 'selected' : ''}>${num} - ${getRatingText(num)}</option>`
//                             ).join('')}
//                         </select>
//                         ${anime.userRating > 0 ? 
//                             `<button class="change-rating-btn" onclick="enableRatingChange(${anime.id})">Change Rating</button>` : 
//                             ''
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div class="characters-section">
//             <h2>Main Characters</h2>
//             <div class="characters-grid">
//                 ${anime.characters.map(character => `
//                     <div class="character-card" onclick="viewCharacterDetails('${character.name}')">
//                         <div class="character-name">${character.name}</div>
//                         <div class="character-role">${character.role}</div>
//                     </div>
//                 `).join('')}
//             </div>
//         </div>
//     `;
// }

// // Show main page (back button)
// function showMainPage() {
//     document.querySelector('.main-container').style.display = 'block';
//     document.getElementById('animeDetailsSection').style.display = 'none';
// }

// // View character details
// function viewCharacterDetails(characterName) {
//     let character = null;
//     let animeTitle = '';
    
//     for (let anime of animeData.animes) {
//         const foundChar = anime.characters.find(char => char.name === characterName);
//         if (foundChar) {
//             character = foundChar;
//             animeTitle = anime.title;
//             break;
//         }
//     }
    
//     if (character) {
//         alert(`Character: ${character.name}\nRole: ${character.role}\nAnime: ${animeTitle}`);
//     }
// }

// // Update the existing viewAnimeDetails function to use new system
// function viewAnimeDetails(animeId) {
//     showAnimeDetails(animeId);
// }