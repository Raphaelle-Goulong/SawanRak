import '../Categories/Categories.scss';
import Card from '../../Card/Card';

function Categories({ books }) {
    // Grouper les livres par catégorie
    const booksByCategory = books.reduce((acc, book) => {
        const category = book.categorie || 'Non classé';
        if (!acc[category]) acc[category] = [];
        acc[category].push(book);
        return acc;
    }, {});

    return (
        <div className="Section-Categories">
            <h2>Catégories</h2>
            
            {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
                <div key={category} className="Category-group">
                    <h3 className="Category-title">{category}</h3>
                    <div className="Category-books">
                        {categoryBooks.map(book => (
                            <Card key={book.id} Book={book} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Categories;