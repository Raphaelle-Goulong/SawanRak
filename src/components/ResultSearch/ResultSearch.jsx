import { useEffect } from 'react'

import { X } from 'lucide-react'

import Data from '../../Data.json'
import Card from '../Card/Card'

import './ResultSearch.scss'




function ResultSearch({ searchTerm, isOpen, onClose, onBookSelect }) {

    // Normalisation des catégories
    const normalizedBooks = Data.map((book) => ({
        ...book,
        categorie: Array.isArray(book.categorie) ? book.categorie : [book.categorie]
    }))

    // Filtrage des livres selon le terme de recherche (titre et auteur uniquement)
    const filteredBooks = searchTerm
        ? normalizedBooks.filter((book) => {
              const searchLower = searchTerm.toLowerCase().trim()
              
              // Recherche dans le titre
              const titleMatch = book.title.toLowerCase().includes(searchLower)
              
              // Recherche dans l'auteur
              const authorMatch = book.auteur && book.auteur.toLowerCase().includes(searchLower)
              
              return titleMatch || authorMatch
          })
        : []

    // Fonction pour ajouter aux derniers consultés
    const addToLastViewed = (bookId) => {
        try {
            const stored = localStorage.getItem('lastViewedBooks')
            let viewedBooks = stored ? JSON.parse(stored) : []
            viewedBooks = viewedBooks.filter((id) => id !== bookId)
            viewedBooks.unshift(bookId)
            viewedBooks = viewedBooks.slice(0, 10)
            localStorage.setItem('lastViewedBooks', JSON.stringify(viewedBooks))
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error)
        }
    }

    const handleCardClick = (book) => {
        addToLastViewed(book.id)
        // Fermer la modale de recherche
        onClose()
        // Informer le parent (Search/Home) du livre sélectionné
        if (onBookSelect) {
            onBookSelect(book)
        }
    }

    // Fermer la modale de recherche quand on appuie sur Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Bloquer le scroll quand la modale est ouverte
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <>
            <div className={`result-search-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
                <div className="result-search-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            Résultats de recherche
                            {searchTerm && <span> pour "{searchTerm}"</span>}
                        </h2>
                        <button className="close-btn" onClick={onClose} aria-label="Fermer">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {filteredBooks.length > 0 ? (
                            <>
                                <p className="results-count">{filteredBooks.length} livre(s) trouvé(s)</p>
                                <div className="results-grid">
                                    {filteredBooks.map((book, index) => (
                                        <div 
                                            key={book.id}
                                            style={{
                                                animationDelay: `${index * 0.05}s`
                                            }}
                                            className="result-item"
                                        >
                                            <Card
                                                Book={book}
                                                onClick={() => handleCardClick(book)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="no-results">
                                <p>Aucun résultat trouvé</p>
                                <span>Essaie avec un autre terme de recherche</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultSearch