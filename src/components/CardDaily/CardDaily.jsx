import '../CardDaily/CardDaily.scss'
import Tags from '../../components/Tags/Tags' // Assure-toi que le chemin est bon

function CardDaily({ Book, onClick = () => {} }) {
    if (!Book) return null

    return (
        <section className="cardDaily-section" onClick={() => onClick(Book)}>
            <div className="cardDaily-card">
                <div className="cardDaily-img">
                    <img src={Book.cover} alt={`Couverture de ${Book.title}`} loading="lazy" />
                </div>
                <div className="cardDaily-resume">
                    <h2>{Book.title}</h2>
                    <h3>{Book.auteur}</h3>
                    
                    <div className='cardDaily-text'>
                       <p>{Book.description}</p> 
                    </div>
                    
                    {/* Si tu veux afficher les tags du livre : */}
                    {Book.categorie && (
                        <div className="cardDaily-tags">
                            <Tags tags={Book.categorie} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default CardDaily