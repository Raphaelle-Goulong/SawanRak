import '../Categories/Categories.scss'
import Carrousel from '../../Carrousel/Carrousel'
import Data from '../../../Data.json'
import Card from '../../Card/Card'

function Categories({ filterType = 'Categories', onCardClick: onClick }) {
    // Valeur par défaut : 'Categories'
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
        'Adulte',
        'Drame'
    ]
    const books = Data

    // Grouper les livres par auteur
    const booksByAuthor = Data.reduce((acc, book) => {
        const author = book.auteur || 'Inconnu' // Gère les auteurs non spécifiés
        if (!acc[author]) {
            acc[author] = []
        }
        acc[author].push(book)
        return acc
    }, {})

    const sortedAuthors = Object.keys(booksByAuthor).sort()

    return (
        <div className="Categories-Container">
            {/* Afficher seulement la section correspondant au filtre */}
            {filterType === 'Categories' && (
                <div className="Section-Categories">
                    <h2 className='Title-Categories'>Catégories</h2>
                    {categories.map((category) => (
                        <div key={category} className="Category-group">
                            {/* <h3 className="Category-title">{category}</h3> */}
                            <div className="Category-books">
                                <Carrousel
                                    category={category}
                                    books={books}
                                    onCardClick={onClick}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filterType === 'Author' && (
                <div className="Section-Author">
                    <h2>Auteurs</h2>
                    {sortedAuthors.map((author) => (
                        <div key={author} className="Author-group">
                            <h3 className="Author-name">{author}</h3>
                            <div className="Author-books">
                                {booksByAuthor[author].map((book) => (
                                    <Card key={book.id} Book={book} onClick={() => onClick(book)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filterType === 'All' && (
                <div className="Section-AllBooks">
                    <h2>Tous les Livres ({books.length})</h2>
                    <div className="AllBooks-grid">
                        {books.map((book) => (
                            <Card key={book.id} Book={book} onClick={() => onClick(book)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
