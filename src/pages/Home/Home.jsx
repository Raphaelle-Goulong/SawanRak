import { useState } from 'react' // Ajoutez cette importation
import Data from '../../Data.json'
import '../Home/Home.scss'
import Card from '../../components/Card/Card'
import Carrousel from '../../components/Carrousel/Carrousel'
import Categories from '../../components/Sort/Categories/Categories'
import Resume from '../../components/Resume/Resume'

function Home({ searchTerm, filterType, setFilterType, }) {
    const [selectedBook, setSelectedBook] = useState(null) // Ajoutez cet état
    const sortedBooks = [...Data].sort((a, b) => new Date(b.date) - new Date(a.date))

    const handleCardClick = (book) => {
        setSelectedBook(book)
    }

    const handleCloseResume = () => {
        setSelectedBook(null)
    }

    const filteredBooks = searchTerm
        ? Data.filter((book) => {
              const searchLower = searchTerm.toLowerCase()
              return (
                  book.title.toLowerCase().includes(searchLower) ||
                  (book.auteur && book.auteur.toLowerCase().includes(searchLower))
              )
          })
        : sortedBooks

    const displayBooks = searchTerm ? filteredBooks : sortedBooks.slice(0, 3)

    const categories = [
        'Comédie',
        'Romance',
        'Entreprise',
        'Mystique',
        'School',
        'Hospital',
        'Ennemies to Lovers',
        'Action',
        'Red Flag',
        'Adulte'
    ]

    const getFilteredBooks = () => {
        let filtered = [...Data]

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
                return filtered.sort((a, b) => a.categorie?.localeCompare(b.categorie))
            default:
                return filtered
        }
    }

    const finalBooks = getFilteredBooks()

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
                                        onClick={() => handleCardClick(book)} // Cette méthode est correcte
                                    />
                                ))}
                            </div>
                        </section>

                        <section className="Home-Books-section">
                            <div className="Home-Books">
                                <Categories filterType={filterType} onCardClick={handleCardClick}/>
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
                                    onClick={() => handleCardClick(book)} // Remplacez la div wrapper par cette version
                                />
                            ))}
                        </div>
                        {finalBooks.length === 0 && (
                            <p className="No-results">Aucun résultat trouvé</p>
                        )}
                    </section>
                )}
            </div>

            {/* Affiche le Resume si un livre est sélectionné */}
            {selectedBook && (
                <div className="resume-modal-overlay" onClick={() => setSelectedBook(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <Resume book={selectedBook} onClose={() => setSelectedBook(null)} />
                    </div>
                </div>
            )}
        </section>
    )
}

export default Home
