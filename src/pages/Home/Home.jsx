import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Data from '../../Data.json'

import '../Home/Home.scss'

import Card from '../../components/Card/Card'
import Categories from '../../components/Sort/Categories/Categories'
import Resume from '../../components/Resume/Resume'




function Home({ filterType, onBookSelectFromSearch }) {
    const [selectedBook, setSelectedBook] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [lastViewedBooks, setLastViewedBooks] = useState([])
    const location = useLocation()

    // Fonction pour récupérer les derniers livres consultés depuis le localStorage
    const getLastViewedBooks = () => {
        try {
            const stored = localStorage.getItem('lastViewedBooks')
            if (stored) {
                const bookIds = JSON.parse(stored)
                const books = bookIds
                    .map((id) => Data.find((book) => book.id === id))
                    .filter((book) => book !== undefined)
                    .slice(0, 1)
                return books
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des livres consultés:', error)
        }
        return []
    }

    // Fonction pour ajouter un livre aux derniers consultés
    const addToLastViewed = (bookId) => {
        try {
            const stored = localStorage.getItem('lastViewedBooks')
            let viewedBooks = stored ? JSON.parse(stored) : []
            viewedBooks = viewedBooks.filter((id) => id !== bookId)
            viewedBooks.unshift(bookId)
            viewedBooks = viewedBooks.slice(0, 10)
            localStorage.setItem('lastViewedBooks', JSON.stringify(viewedBooks))
            setLastViewedBooks(getLastViewedBooks())
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du livre consulté:', error)
        }
    }

    // Normalisation des catégories
    const normalizedBooks = Data.map((book) => ({
        ...book,
        categorie: Array.isArray(book.categorie) ? book.categorie : [book.categorie]
    }))

    const sortedBooks = [...normalizedBooks].sort((a, b) => new Date(b.date) - new Date(a.date))
    const displayBooks = sortedBooks.slice(0, 3)

    const handleCardClick = (book) => {
        setSelectedBook(book)
        setShowModal(true)
        addToLastViewed(book.id)

        setTimeout(() => {
            const modal = document.querySelector('.Section-Resume')
            if (modal) {
                modal.classList.add('visible')
            }
        }, 50)
    }

    const handleCloseResume = () => {
        setIsClosing(true)
        const modal = document.querySelector('.Section-Resume')
        const overlay = document.querySelector('.resume-modal-overlay')

        if (modal) {
            modal.classList.remove('visible')
            modal.classList.add('closing')
        }

        if (overlay) {
            overlay.classList.remove('show')
        }

        setTimeout(() => {
            setSelectedBook(null)
            setShowModal(false)
            setIsClosing(false)
        }, 300)
    }

    // Charger les derniers livres consultés au démarrage
    useEffect(() => {
        const books = getLastViewedBooks()
        setLastViewedBooks(books)
    }, [])

    // Gérer l'ouverture de la modale Resume depuis la recherche
    useEffect(() => {
        if (onBookSelectFromSearch) {
            // Attendre que la modale de recherche soit fermée avec une transition fluide
            const timer = setTimeout(() => {
                handleCardClick(onBookSelectFromSearch)
            }, 400) // Augmenté à 400ms pour une transition plus douce
            
            return () => clearTimeout(timer)
        }
    }, [onBookSelectFromSearch])

    useEffect(() => {
        if (location.state?.fromEnding && location.state?.book) {
            setSelectedBook(location.state.book)
            setShowModal(true)
            addToLastViewed(location.state.book.id)

            setTimeout(() => {
                const modal = document.querySelector('.Section-Resume')
                if (modal) {
                    modal.classList.add('visible')
                }
            }, 100)

            window.history.replaceState({}, document.title)
        }
    }, [location.state])

    useEffect(() => {
        if (showModal) {
            setTimeout(() => {
                const overlay = document.querySelector('.resume-modal-overlay')
                if (overlay) {
                    overlay.classList.add('show')
                }
            }, 10)
        }
    }, [showModal])

    return (
        <section className="Section-Home">
            <div className="Home">
                {/* Dernier livre consulté */}
                {lastViewedBooks.length > 0 && (
                    <section id="Last-book">
                        <div className="Last-Title-Section">
                            <h2>Dernier Livre Consulté</h2>
                        </div>
                        <div className="Last-New-book-card">
                            {lastViewedBooks.map((book) => (
                                <Card
                                    key={`last-viewed-${book.id}`}
                                    Book={book}
                                    onClick={() => handleCardClick(book)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Récents ajouts */}
                <section id="New-book">
                    <div className="Title-Section">
                        <h2>Récents Ajouts</h2>
                    </div>
                    <div className="New-book-card">
                        {displayBooks.map((book) => (
                            <Card
                                key={book.id}
                                Book={book}
                                onClick={() => handleCardClick(book)}
                            />
                        ))}
                    </div>
                </section>

                {/* Catégories */}
                <section className="Home-Books-section">
                    <div className="Home-Books">
                        <Categories filterType={filterType} onCardClick={handleCardClick} />
                    </div>
                </section>
            </div>

            {/* Modal Resume */}
            {showModal && selectedBook && (
                <div className="resume-modal-overlay" onClick={handleCloseResume}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <Resume book={selectedBook} onClose={handleCloseResume} />
                    </div>
                </div>
            )}
        </section>
    )
}

export default Home 