import '../Card/Card.scss';

function Card({ Book }) {

    if (!Book || !Book.cover || !Book.title ) {
    return null; // Ne rend rien si les données sont incomplètes
  }
  return (
    <div className="Card">
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

