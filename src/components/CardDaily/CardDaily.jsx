import '../CardDaily/CardDaily.scss'
import Tags from '../../components/Tags/Tags'

const MAX_TAGS = 2

function CardDaily({ Book, onClick = () => {} }) {
    if (!Book) return null

    const categories = (Array.isArray(Book.categorie) ? Book.categorie : [Book.categorie])
        .filter(Boolean)
        .slice(0, MAX_TAGS)

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(Book)
        }
    }

    return (
        <div
            className="cardDaily-section"
            role="button"
            tabIndex={0}
            aria-label={`${Book.title}${Book.auteur ? `, par ${Book.auteur}` : ''}`}
            onClick={() => onClick(Book)}
            onKeyDown={handleKeyDown}
        >
            <div className="cardDaily-card">
                <div className="cardDaily-img">
                    <img
                        src={Book.cover}
                        alt=""
                        width="92"
                        height="138"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="cardDaily-resume">
                    <h2>{Book.title}</h2>
                    {Book.auteur && <h3>{Book.auteur}</h3>}

                    {Book.description && (
                        <div className="cardDaily-text">
                            <p>{Book.description}</p>
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="cardDaily-tags">
                            {categories.map((category) => (
                                <Tags key={category} text={category} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CardDaily