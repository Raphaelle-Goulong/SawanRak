import '../CardDaily/CardDaily.scss'
import Tags from '../../components/Tags/Tags'

function CardDaily({ Book, onClick = () => {} }) {
    if (!Book) return null

    return (
        <section className="cardDaily-section" onClick={() => onClick(Book)}>
            <div className="cardDaily-card">
                <div className="cardDaily-img">
                    <img src={Book.cover} alt={`Couverture de ${Book.title}`} />
                </div>
                <div className="cardDaily-resume">
                    <h2>{Book.title}</h2>
                    <h3>{Book.auteur}</h3>
                    
                    <div className='cardDaily-text'>
                       <p>{Book.description}</p> 
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default CardDaily
