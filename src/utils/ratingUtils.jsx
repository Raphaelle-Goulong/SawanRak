// utils/ratingUtils.js

/**
 * Récupère la note d'un livre depuis localStorage
 * @param {string} bookId - L'ID du livre
 * @returns {number|null} - La note (1-5) ou null si pas de note
 */
export const getBookRating = (bookId) => {
    const rating = localStorage.getItem(`book-${bookId}-rating`);
    return rating ? parseInt(rating, 10) : null;
};

/**
 * Sauvegarde la note d'un livre dans localStorage
 * @param {string} bookId - L'ID du livre
 * @param {number} rating - La note (1-5)
 */
export const saveBookRating = (bookId, rating) => {
    localStorage.setItem(`book-${bookId}-rating`, rating.toString());
    localStorage.setItem(`book-${bookId}-rating-date`, new Date().toISOString());
};

/**
 * Supprime la note d'un livre
 * @param {string} bookId - L'ID du livre
 */
export const removeBookRating = (bookId) => {
    localStorage.removeItem(`book-${bookId}-rating`);
    localStorage.removeItem(`book-${bookId}-rating-date`);
};

/**
 * Récupère toutes les notes des livres
 * @returns {Object} - Un objet avec les IDs des livres comme clés et les notes comme valeurs
 */
export const getAllRatings = () => {
    const ratings = {};
    
    // Parcourir toutes les clés de localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('book-') && key.endsWith('-rating')) {
            // Extraire l'ID du livre de la clé
            const bookId = key.replace('book-', '').replace('-rating', '');
            const rating = parseInt(localStorage.getItem(key), 10);
            ratings[bookId] = rating;
        }
    }
    
    return ratings;
};

/**
 * Calcule la note moyenne de tous les livres notés
 * @returns {number} - La note moyenne arrondie à 1 décimale
 */
export const getAverageRating = () => {
    const ratings = getAllRatings();
    const ratingValues = Object.values(ratings);
    
    if (ratingValues.length === 0) return 0;
    
    const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / ratingValues.length) * 10) / 10;
};

/**
 * Récupère les livres les mieux notés
 * @param {number} limit - Nombre maximum de livres à retourner
 * @returns {Array} - Tableau des IDs de livres triés par note décroissante
 */
export const getTopRatedBooks = (limit = 5) => {
    const ratings = getAllRatings();
    
    return Object.entries(ratings)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([bookId]) => bookId);
};

/**
 * Vérifie si un livre a été noté
 * @param {string} bookId - L'ID du livre
 * @returns {boolean} - True si le livre a été noté
 */
export const hasUserRated = (bookId) => {
    return localStorage.getItem(`book-${bookId}-rating`) !== null;
};

/**
 * Récupère les statistiques des notes
 * @returns {Object} - Statistiques détaillées
 */
export const getRatingStats = () => {
    const ratings = getAllRatings();
    const ratingValues = Object.values(ratings);
    
    if (ratingValues.length === 0) {
        return {
            totalRated: 0,
            averageRating: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingValues.forEach(rating => {
        distribution[rating]++;
    });
    
    const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
    
    return {
        totalRated: ratingValues.length,
        averageRating: Math.round((sum / ratingValues.length) * 10) / 10,
        distribution
    };
};