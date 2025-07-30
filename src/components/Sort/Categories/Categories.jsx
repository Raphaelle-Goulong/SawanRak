import '../Categories/Categories.scss'
import Carrousel from '../../Carrousel/Carrousel'
import Data from '../../../Data.json'
import Card from '../../Card/Card'

function Categories({ filterType = 'Categories', onCardClick: onClick }) {
   
    const books = Data

    // Grouper les livres par auteur
    // Récupération DYNAMIQUE de toutes les catégories existantes
    const allCategories = [...new Set(
        books.flatMap(book => 
            Array.isArray(book.categorie) ? book.categorie : [book.categorie]
        ).filter(Boolean) // Filtre les valeurs nulles/undefined
    )].sort(); // Tri alphabétique

    // Grouper les livres par auteur
    const booksByAuthor = books.reduce((acc, book) => {
        const author = book.auteur || 'Inconnu';
        if (!acc[author]) acc[author] = [];
        acc[author].push(book);
        return acc;
    }, {});

    // Trier les auteurs par ordre alphabétique
    const sortedAuthors = Object.keys(booksByAuthor).sort()
    
    // Trier les livres de chaque auteur par titre (avec gestion des titres manquants)
    sortedAuthors.forEach(author => {
        booksByAuthor[author].sort((a, b) => {
            const titleA = a.titre || '';
            const titleB = b.titre || '';
            return titleA.localeCompare(titleB);
        });
    })

    // Trier tous les livres par titre pour la section "All Books" (avec gestion des titres manquants)
    const sortedBooks = [...books].sort((a, b) => {
        const titleA = a.titre || '';
        const titleB = b.titre || '';
        return titleA.localeCompare(titleB);
    });

    return (
        <div className="Categories-Container">
            {/* Afficher seulement la section correspondant au filtre */}
            {filterType === 'Categories' && (
                <div className="Section-Categories">
                    <h2 className='Title-Categories'>Catégories</h2>
                    {allCategories.map((category) => (
                        <div key={category} className="Category-group">
                            <div className="Category-books">
                                 <Carrousel
                                    category={category}
                                    books={books.filter(book => 
                                        Array.isArray(book.categorie) 
                                            ? book.categorie.includes(category)
                                            : book.categorie === category
                                    )}
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
                        {sortedBooks.map((book) => (
                            <Card key={book.id} Book={book} onClick={() => onClick(book)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories