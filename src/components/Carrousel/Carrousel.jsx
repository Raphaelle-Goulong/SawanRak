import '../Carrousel/Carrousel.scss'

import Card from '../Card/Card'

function Carrousel({ category, books, onCardClick }) {
    // Filtre de sécurité (Categories filtre déjà les livres)
    const filteredBooks = books.filter(
        (book) =>
            book.categorie &&
            (Array.isArray(book.categorie)
                ? book.categorie.includes(category)
                : book.categorie === category)
    )

    if (filteredBooks.length === 0) return null

    return (
        <section className="Carrousel" aria-label={category}>
            <div className="Title-carrousel">
                <h3>{category}</h3>
            </div>

            <div className="carrousel-container">
                <div className="cards-container">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="card-wrapper">
                            <Card Book={book} onClick={() => onCardClick(book)} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Carrousel