import '../Author/Author.scss';
import Card from '../../Card/Card';

function Author({ books }) {
    // Grouper les livres par auteur
    const booksByAuthor = books.reduce((acc, book) => {
        const author = book.auteur || 'Inconnu';
        if (!acc[author]) acc[author] = [];
        acc[author].push(book);
        return acc;
    }, {});

    return (
        <div className="Section-Author">
            <h2>Auteurs</h2>
            {Object.entries(booksByAuthor).map(([author, authorBooks]) => (
                <div key={author} className="Author-group">
                    <h3 className="Author-name">{author}</h3>
                    <div className="Author-books">
                        {authorBooks.map(book => (
                            <Card key={book.id} Book={book} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Author;
