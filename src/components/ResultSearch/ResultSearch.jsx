import { useState, useEffect, useMemo } from 'react'
import { X } from 'lucide-react'

import Card from '../Card/Card'
import useLivres from '../../hooks/useLivres'

import './ResultSearch.scss'

// Minuscules, sans accents : « Étoile » et « etoile » se trouvent mutuellement
const normalize = (text) =>
    String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

function ResultSearch({ searchTerm, isOpen, onClose, onBookSelect }) {
    const { books } = useLivres()
    const [visible, setVisible] = useState(false)

    // Recherche dans le titre et l'auteur
    const filteredBooks = useMemo(() => {
        const query = normalize(searchTerm)
        if (!query) return []
        return books.filter(
            (book) => normalize(book.title).includes(query) || normalize(book.auteur).includes(query)
        )
    }, [books, searchTerm])

    // Animation d'entrée
    useEffect(() => {
        if (!isOpen) {
            setVisible(false)
            return undefined
        }
        const timer = setTimeout(() => setVisible(true), 10)
        return () => clearTimeout(timer)
    }, [isOpen])

    // Échap ferme la recherche, et la page derrière ne défile plus
    useEffect(() => {
        if (!isOpen) return undefined

        const onKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        const previousOverflow = document.body.style.overflow

        window.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen, onClose])

    const handleCardClick = (book) => {
        onClose()
        // Home ouvre la fiche et enregistre le livre dans les derniers consultés
        if (onBookSelect) onBookSelect(book)
    }

    if (!isOpen) return null

    return (
        <div className={`result-search-overlay${visible ? ' show' : ''}`} onClick={onClose}>
            <div
                className="result-search-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Résultats de recherche"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>
                        Résultats
                        {searchTerm && <span> pour « {searchTerm} »</span>}
                    </h2>
                    <button type="button" className="close-btn" onClick={onClose} aria-label="Fermer">
                        <X size={22} />
                    </button>
                </div>

                <div className="modal-body">
                    {filteredBooks.length > 0 ? (
                        <>
                            <p className="results-count">
                                {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''} trouvé
                                {filteredBooks.length > 1 ? 's' : ''}
                            </p>
                            <div className="results-grid">
                                {filteredBooks.map((book, index) => (
                                    <div
                                        key={book.id}
                                        className="result-item"
                                        style={{ animationDelay: `${Math.min(index, 12) * 0.04}s` }}
                                    >
                                        <Card Book={book} onClick={() => handleCardClick(book)} />
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
    )
}

export default ResultSearch