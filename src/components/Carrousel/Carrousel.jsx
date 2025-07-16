import { useState, useRef, useEffect } from 'react'
import '../Carrousel/Carrousel.scss'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../Card/Card'

function Carrousel({ category, books, onCardClick }) {
       const [startIndex, setStartIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const carrouselRef = useRef(null)
    
    // Filtrage des livres - Correction ici (parenthèse manquante)
    const filteredBooks = books.filter(book => 
        book.categorie && 
        (Array.isArray(book.categorie) 
            ? book.categorie.includes(category) 
            : book.categorie === category)
    ) // Parenthèse fermante ajoutée ici

    // Calcul dynamique du nombre d'éléments visibles
    const [visibleItems, setVisibleItems] = useState(5)
    const containerRef = useRef(null)

    useEffect(() => {
        const calculateVisibleItems = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const cardWidth = 180 // Largeur approximative de vos cartes + margin
                const newVisibleItems = Math.floor(containerWidth / cardWidth)
                setVisibleItems(Math.max(1, newVisibleItems))
            }
        }

        calculateVisibleItems()
        window.addEventListener('resize', calculateVisibleItems)
        return () => window.removeEventListener('resize', calculateVisibleItems)
    }, [])
    // Fonction pour passer au slide suivant
    const nextSlide = () => {
        if (isAnimating || filteredBooks.length <= visibleItems) return
        setIsAnimating(true)
        
        if (startIndex + visibleItems >= filteredBooks.length) {
            setStartIndex(0)
        } else {
            setStartIndex(Math.min(startIndex + 1, filteredBooks.length - visibleItems))
        }
        
        setTimeout(() => setIsAnimating(false), 500)
    }

    // Fonction pour revenir au slide précédent
    const prevSlide = () => {
        if (isAnimating || filteredBooks.length <= visibleItems) return
        setIsAnimating(true)
        
        if (startIndex <= 0) {
            setStartIndex(Math.max(0, filteredBooks.length - visibleItems))
        } else {
            setStartIndex(startIndex - 1)
        }
        
        setTimeout(() => setIsAnimating(false), 500)
    }

    // Fonction pour obtenir les livres visibles
    const getVisibleBooks = () => {
        if (filteredBooks.length <= visibleItems) {
            return filteredBooks
        }
        
        if (startIndex + visibleItems <= filteredBooks.length) {
            return filteredBooks.slice(startIndex, startIndex + visibleItems)
        } else {
            const end = filteredBooks.slice(startIndex)
            const remaining = visibleItems - end.length
            return [...end, ...filteredBooks.slice(0, remaining)]
        }
    }

    return (
        <div className="Carrousel">
            {/* Debug visuel si aucune donnée */}
            {filteredBooks.length === 0 && (
                <div style={{ color: 'red', padding: '10px' }}>
                    Aucun livre trouvé pour la catégorie "{category}"
                </div>
            )}

            <div className="Title-carrousel">
                <h2>{category} ({filteredBooks.length})</h2>
            </div>

            {filteredBooks.length > 0 && (
                <div className="carrousel-container">
                    {filteredBooks.length > visibleItems && (
                        <button className="nav-button left" onClick={prevSlide}>
                            <ChevronLeft size={28} />
                        </button>
                    )}
                    
                    <div 
                        className={`cards-container ${isAnimating ? 'animating' : ''}`}
                        ref={carrouselRef}
                    >
                        {getVisibleBooks().map((book, index) => (
                            <div 
                                key={book.id} 
                                className={`card-wrapper ${index === Math.floor(visibleItems / 2) ? 'center' : ''}`}
                            >
                                <Card 
                                    Book={book} 
                                    onClick={() => onCardClick(book)}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {filteredBooks.length > visibleItems && (
                        <button className="nav-button right" onClick={nextSlide}>
                            <ChevronRight size={28} />
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Carrousel