import '../Card/Card.scss';

function Card({ Book, onClick }) {
    if (!Book || !Book.cover || !Book.title) {
        return null;
    }
    return (
        <div className="Card" onClick={(e) => {
            e.stopPropagation(); // Empêche la propagation
            onClick();
        }}>
            <div className="Img-books">
                <img src={Book.cover} alt={`Couverture de ${Book.title}`} />
            </div>
            <div className="Title-books">
                <h3>{Book.title}</h3>
            </div>
        </div>
    );
}

export default Card;