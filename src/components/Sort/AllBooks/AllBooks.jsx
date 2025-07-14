import '../AllBooks/AllBooks.scss';
import Card from '../../Card/Card';

function AllBooks({ books }) {
    return (
        <div className="Section-AllBooks">
            <h2>Tous les Livres ({books.length})</h2>
            <div className="AllBooks-grid">
                {books.map(book => (
                    <Card key={book.id} Book={book} />
                ))}
            </div>
        </div>
    );
}

export default AllBooks;