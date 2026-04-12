import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Data from '../../Data.json'
import '../Ending/Ending.scss'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import StarRating from '../../components/StarRating/StarRating'
import { X } from 'lucide-react'

function Ending({ onClose }) {
    const location = useLocation()
    const navigate = useNavigate()
    const currentBook = location.state?.book
    const [similarBooks, setSimilarBooks] = useState([])
    const [userRating, setUserRating] = useState(0)
    const [hasRated, setHasRated] = useState(false)

    // Charger la note existante depuis localStorage
    useEffect(() => {
        if (currentBook?.id) {
            const savedRating = localStorage.getItem(`book-${currentBook.id}-rating`)
            if (savedRating) {
                setUserRating(parseInt(savedRating, 10))
                setHasRated(true)
            }
        }
    }, [currentBook])

    // Gestion des livres similaires - Prendre la PREMIÈRE catégorie
    useEffect(() => {
        if (currentBook && currentBook.categorie) {
            // Récupérer la première catégorie du livre actuel
            const firstCategory = Array.isArray(currentBook.categorie)
                ? currentBook.categorie[0]
                : currentBook.categorie

            const sameCategoryBooks = Data.filter((book) => {
                const bookCategories = Array.isArray(book.categorie)
                    ? book.categorie
                    : [book.categorie]

                return (
                    book.id !== currentBook.id && bookCategories.includes(firstCategory) // Chercher seulement la première catégorie
                )
            })

            const shuffled = [...sameCategoryBooks].sort(() => 0.5 - Math.random())
            setSimilarBooks(shuffled.slice(0, 3))
        }
    }, [currentBook])

    // Fonction pour gérer le changement de note
    const handleRatingChange = (rating) => {
        const newRating = parseInt(rating, 10)
        setUserRating(newRating)
        setHasRated(true)

        if (currentBook?.id) {
            // Sauvegarder dans localStorage
            localStorage.setItem(`book-${currentBook.id}-rating`, newRating.toString())

            // Optionnel : Sauvegarder aussi la date de notation
            localStorage.setItem(`book-${currentBook.id}-rating-date`, new Date().toISOString())

            console.log(`Note sauvegardée pour "${currentBook.title}": ${newRating} étoiles`)
        }
    }

    // Fonction pour gérer le clic sur un livre suggéré
    const handleBookClick = (book) => {
        // Naviguer vers la page Home avec les informations du livre pour ouvrir la modale Resume
        navigate('/', {
            state: {
                fromEnding: true,
                book: book
            }
        })
    }

    return (
        <section className="Section-Ending">
            <X className="cross" size={20} onClick={onClose} />
            <h2>Tu es arrivée à la fin du livre</h2>
            <div class="melting-text-container">
                <h1 class="melting-text">Bye Bye !</h1>
            </div>

            <div className="Note">
                <div className="title">
                    <h3>
                        <h3>N'oublie pas de noter</h3>
                    </h3>
                </div>

                <div className="star">
                    <StarRating
                        bookId={currentBook?.id}
                        onRatingChange={(rating) => {
                            setUserRating(rating)
                            setHasRated(true)
                        }}
                    />
                </div>
            </div>

            <div className="other-books">
                <div className="title">
                    <h3>Livre qui pourrait te plaire</h3>
                </div>
                <div className="book-cat">
                    {similarBooks.length > 0 ? (
                        similarBooks.map((book) => (
                            <Card
                                key={book.id}
                                Book={book}
                                onClick={(e) => {
                                    // e.stopPropagation() // Empêche la propagation vers l'overlay
                                    handleBookClick(book) // Utilise la nouvelle fonction
                                }}
                            />
                        ))
                    ) : (
                        <p>Aucune suggestion disponible</p>
                    )}
                </div>
            </div>

            <div className="btn-quit">
                <Link to="/" className="home-link">
                    <Button onClick={onClose} text="Retour Page Home" />
                </Link>
            </div>
        </section>
    )
}

export default Ending
