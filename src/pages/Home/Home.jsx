import { useState, useEffect } from 'react'
import Data from '../../Data.json'
import { useLocation } from 'react-router-dom'
import '../Home/Home.scss'
import Card from '../../components/Card/Card'
import Carrousel from '../../components/Carrousel/Carrousel'
import Categories from '../../components/Sort/Categories/Categories'
import Resume from '../../components/Resume/Resume'

function Home({ searchTerm, filterType, setFilterType }) {
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
                // Récupérer les détails complets des livres depuis Data.json
                const books = bookIds
                    .map(id => Data.find(book => book.id === id))
                    .filter(book => book !== undefined) // Supprimer les livres qui n'existent plus
                    .slice(0, 3) // Limiter à 3 livres
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
            // Récupérer la liste actuelle
            const stored = localStorage.getItem('lastViewedBooks')
            let viewedBooks = stored ? JSON.parse(stored) : []
            
            // Supprimer le livre s'il existe déjà (pour éviter les doublons)
            viewedBooks = viewedBooks.filter(id => id !== bookId)
            
            // Ajouter le nouveau livre au début de la liste
            viewedBooks.unshift(bookId)
            
            // Limiter à 10 livres maximum pour ne pas surcharger le localStorage
            viewedBooks = viewedBooks.slice(0, 10)
            
            // Sauvegarder dans le localStorage
            localStorage.setItem('lastViewedBooks', JSON.stringify(viewedBooks))
            
            // Mettre à jour l'état local pour re-render le composant
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

    const handleCardClick = (book) => {
        setSelectedBook(book)
        setShowModal(true)

        // IMPORTANT: Ajouter le livre aux derniers consultés
        addToLastViewed(book.id)

        // Ajouter la classe visible après un court délai
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

        // Attendre la fin de l'animation avant de fermer
        setTimeout(() => {
            setSelectedBook(null)
            setShowModal(false)
            setIsClosing(false)
        }, 300)
    }

    // Gestion des filtres et recherche
    const filteredBooks = searchTerm
        ? normalizedBooks.filter((book) => {
              const searchLower = searchTerm.toLowerCase()
              return (
                  book.title.toLowerCase().includes(searchLower) ||
                  (book.auteur && book.auteur.toLowerCase().includes(searchLower))
              )
          })
        : sortedBooks

    const displayBooks = searchTerm ? filteredBooks : sortedBooks.slice(0, 3)

    const getFilteredBooks = () => {
        let filtered = [...normalizedBooks]

        if (searchTerm) {
            filtered = filtered.filter(
                (book) =>
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (book.auteur && book.auteur.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        switch (filterType) {
            case 'Author':
                return filtered.sort((a, b) => a.auteur?.localeCompare(b.auteur))
            case 'Categories':
                return filtered.sort((a, b) => a.categorie[0]?.localeCompare(b.categorie[0]))
            default:
                return filtered
        }
    }

    const finalBooks = getFilteredBooks()

    // Charger les derniers livres consultés au démarrage du composant
    useEffect(() => {
        const books = getLastViewedBooks()
        setLastViewedBooks(books)
    }, [])

    useEffect(() => {
        if (location.state?.fromEnding && location.state?.book) {
            setSelectedBook(location.state.book)
            setShowModal(true)

            // Ajouter aussi ce livre aux derniers consultés
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

    // Ajouter la classe 'show' à l'overlay après le montage
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
                {!searchTerm ? (
                    <>
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

                        {/* Section pour les derniers livres consultés */}
                        {lastViewedBooks.length > 0 && (
                            <section id="Last-book">
                                <div className="Last-Title-Section">
                                    <h2>Derniers Livres Consultés</h2>
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

                        <section className="Home-Books-section">
                            <div className="Home-Books">
                                <Categories filterType={filterType} onCardClick={handleCardClick} />
                            </div>
                        </section>
                    </>
                ) : (
                    <section className="Search-results">
                        <div className="Title-Section">
                            <h2>Résultats de recherche ({finalBooks.length})</h2>
                        </div>
                        <div className="Results-grid">
                            {finalBooks.map((book) => (
                                <Card
                                    key={book.id}
                                    Book={book}
                                    onClick={() => handleCardClick(book)}
                                />
                            ))}
                        </div>
                        {finalBooks.length === 0 && (
                            <p className="No-results">Aucun résultat trouvé</p>
                        )}
                    </section>
                )}
            </div>

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