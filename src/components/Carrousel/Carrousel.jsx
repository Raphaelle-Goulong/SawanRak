import { useState } from 'react'
import '../Carrousel/Carrousel.scss'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../Card/Card'

function Carrousel({ category, books , onCardClick}) {
    const [startIndex, setStartIndex] = useState(0)
    const filteredBooks = books.filter((book) => book.categorie === category)

    const nextSlide = () => {
        // Si on arrive à la fin, retour au début
        if (startIndex + 3 >= filteredBooks.length) {
            setStartIndex(0)
        } else {
            setStartIndex(startIndex + 1)
        }
    }

    const prevSlide = () => {
        // Si on est au début, aller à la fin
        if (startIndex <= 0) {
            setStartIndex(Math.max(0, filteredBooks.length - 3))
        } else {
            setStartIndex(startIndex - 1)
        }
    }

    // Gère l'affichage des livres (y compris le "rebouclage")
    const getVisibleBooks = () => {
        // Cas normal
        if (startIndex + 3 <= filteredBooks.length) {
            return filteredBooks.slice(startIndex, startIndex + 3)
        }
        // Cas où on doit "reboucler"
        else {
            const end = filteredBooks.slice(startIndex)
            const remaining = 3 - end.length
            return [...end, ...filteredBooks.slice(0, remaining)]
        }
    }

    return (
        <div className="Carrousel">
            <div className="Title-carrousel">
                <h2>{category}</h2>
            </div>

            <div className="Cards-carrousel">
                <ChevronLeft id="arrow-left" size={28} onClick={prevSlide} />
                {getVisibleBooks().map((book) => (
                     <Card 
                        key={book.id} 
                        Book={book} 
                        onClick={() => onCardClick(book)}  // Passez l'événement
                    />
                ))}
                <ChevronRight id="arrow-right" size={28} onClick={nextSlide} />
            </div>
        </div>
    )
}

export default Carrousel