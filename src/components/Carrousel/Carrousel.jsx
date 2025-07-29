import { useState, useRef } from 'react'
import '../Carrousel/Carrousel.scss'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../Card/Card'

function Carrousel({ category, books, onCardClick }) {
    const [isAnimating, setIsAnimating] = useState(false)
    const carrouselRef = useRef(null)
    
    // Filtrage des livres
    const filteredBooks = books.filter(book => 
        book.categorie && 
        (Array.isArray(book.categorie) 
            ? book.categorie.includes(category) 
            : book.categorie === category)
    )

    // Fonction pour passer au slide suivant (désactivée)
    const nextSlide = () => {
        // Ne rien faire - désactivé car on affiche tout
    }

    // Fonction pour revenir au slide précédent (désactivée)
    const prevSlide = () => {
        // Ne rien faire - désactivé car on affiche tout
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
                    {/* Conteneur principal avec défilement horizontal */}
                    <div 
                        className="cards-container"
                        ref={carrouselRef}
                    >
                        {filteredBooks.map((book, index) => (
                            <div 
                                key={book.id} 
                                className="card-wrapper"
                            >
                                <Card 
                                    Book={book} 
                                    onClick={() => onCardClick(book)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Carrousel