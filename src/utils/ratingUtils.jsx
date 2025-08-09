// utils/ratingUtils.js
// Utilitaires pour gérer les notes dans localStorage

/**
 * Récupère la note d'un livre
 * @param {string} bookId - ID du livre
 * @returns {number|null} - Note (1-5) ou null si pas de note
 */
export const getBookRating = (bookId) => {
    const rating = localStorage.getItem(`book-${bookId}-rating`)
    return rating ? parseInt(rating, 10) : null
}

/**
 * Sauvegarde la note d'un livre
 * @param {string} bookId - ID du livre
 * @param {number} rating - Note (1-5)
 */
export const saveBookRating = (bookId, rating) => {
    localStorage.setItem(`book-${bookId}-rating`, rating.toString())
    localStorage.setItem(`book-${bookId}-rating-date`, new Date().toISOString())
}

/**
 * Récupère toutes les notes des livres
 * @returns {Object} - Objet avec bookId en clé et rating en valeur
 */
export const getAllBookRatings = () => {
    const ratings = {}
    
    // Parcourir tous les items du localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        
        if (key && key.startsWith('book-') && key.endsWith('-rating')) {
            // Extraire l'ID du livre depuis la clé
            const bookId = key.replace('book-', '').replace('-rating', '')
            const rating = parseInt(localStorage.getItem(key), 10)
            
            if (!isNaN(rating)) {
                ratings[bookId] = rating
            }
        }
    }
    
    return ratings
}

/**
 * Supprime la note d'un livre
 * @param {string} bookId - ID du livre
 */
export const removeBookRating = (bookId) => {
    localStorage.removeItem(`book-${bookId}-rating`)
    localStorage.removeItem(`book-${bookId}-rating-date`)
}

/**
 * Récupère les statistiques des notes
 * @returns {Object} - Stats des notes
 */
export const getRatingStats = () => {
    const ratings = getAllBookRatings()
    const values = Object.values(ratings)
    
    if (values.length === 0) {
        return {
            totalBooks: 0,
            averageRating: 0,
            ratingDistribution: {}
        }
    }
    
    const total = values.reduce((sum, rating) => sum + rating, 0)
    const average = total / values.length
    
    // Distribution des notes
    const distribution = {}
    values.forEach(rating => {
        distribution[rating] = (distribution[rating] || 0) + 1
    })
    
    return {
        totalBooks: values.length,
        averageRating: Math.round(average * 10) / 10, // Arrondi à 1 décimale
        ratingDistribution: distribution
    }
}