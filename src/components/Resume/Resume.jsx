import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Data from '../../Data.json'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import StarRating from '../../components/StarRating/StarRating'
import Heart from '../Heart/Heart'
import ButtonRead from '../ButtonRead/ButtonRead'
import { ArrowLeft } from 'lucide-react'
import { BookOpen } from 'lucide-react'

// Modale qui s'affiche quand on clique sur une Card
// Affiche les infos du livre : cover, titre, auteur, étoiles, synopsis, livres du même auteur
// Props : book (objet livre), onClose (fonction pour fermer la modale)
function Resume({ book, onClose }) {
    const navigate = useNavigate()

    // Stocke les infos du dernier chapitre lu (récupéré depuis le localStorage)
    const [lastChapterInfo, setLastChapterInfo] = useState(null)

    // Contrôle la visibilité du composant (false = démontage)
    const [isVisible, setIsVisible] = useState(true)

    // Récupère le dernier chapitre lu depuis le localStorage au montage
    useEffect(() => {
        const savedInfo = localStorage.getItem(`book-${book.id}-lastChapterLink`)
        if (savedInfo) {
            const info = JSON.parse(savedInfo)
            setLastChapterInfo({
                ...info,
                // Renomme "Introduction" en "Chapitre 0" pour l'affichage
                chapterTitle: info.chapterTitle.replace('Introduction', 'Chapitre 0')
            })
        }
    }, [book.id])

    // Navigue vers le livre en forçant le chapitre 0 (début)
    const handleReadBook = () => {
        navigate(`/book/${book.id}`, { state: { book, chapterIndex: 0 } })
    }

    // Navigue vers le livre au dernier chapitre lu
    const handleResumeBook = () => {
        navigate(`/book/${book.id}`, {
            state: { book, chapterIndex: lastChapterInfo.chapterIndex }
        })
    }

    // Ferme la modale en cachant le composant et en appelant le callback parent
    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    // Quand on clique sur un livre "Du Même Auteur"
    // Navigue vers la Home avec le livre sélectionné pour ouvrir sa modale Resume
    const handleCardClick = (selectedBook) => {
        navigate('/', {
            state: { fromEnding: true, book: selectedBook }
        })
    }

    // Ne rien afficher si la modale est fermée
    if (!isVisible) return null

    return (
        <section className="Section-Resume">
            <div className="Top-resume">
                <div className="resume-book">

                    {/* Barre du haut : flèche retour + bouton favoris */}
                    <div className="icon-top-resume">
                        <ArrowLeft className="cross" size={30} onClick={handleClose} />
                        <Heart bookId={book.id} />
                    </div>

                    {/* Bloc principal : cover + infos du livre */}
                    <div className="info-resume">

                        {/* Couverture du livre */}
                        <div className="Resume-img-book">
                            <img
                                src={book.cover}
                                alt={`Couverture de ${book.title}`}
                                className="img-book"
                            />
                        </div>

                        {/* Infos texte : titre, étoiles, auteur, genre, boutons */}
                        <div className="in-resume-book">
                            <h2>{book.title}</h2>

                            {/* Étoiles interactives — lit et sauvegarde la note dans le localStorage */}
                            <StarRating bookId={book.id} />

                            <p id="author-name-resume">Auteur : {book.auteur}</p>

                            {/* Genre(s) du livre — gère le cas où categorie est un tableau ou une string */}
                            <p id="gender-resume">
                                <BookOpen id="icon-book-open" size={15} />
                                {(Array.isArray(book.categorie)
                                    ? book.categorie
                                    : [book.categorie].filter(Boolean)
                                ).join(', ')}
                            </p>

                            {/* Boutons de lecture */}
                            <div className="buttons-start">
                                {/* Toujours visible — repart du chapitre 0 */}
                                <div onClick={handleReadBook}>
                                    <ButtonRead text="Lire" />
                                </div>

                                {/* Visible seulement si un chapitre a déjà été lu */}
                                {lastChapterInfo && (
                                    <div onClick={handleResumeBook}>
                                        <ButtonRead text="Reprendre" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Synopsis du livre */}
                    <div className="Resume">
                        <div className="text-resume">
                            <h3 id="title-resume">Synopsis</h3>
                            <p id="resume-book">{book.description}</p>
                        </div>
                    </div>

                    {/* Autres livres du même auteur
                        Filtre Data.json pour exclure le livre actuel
                        Clic sur une card → ouvre sa modale Resume depuis la Home */}
                    <div className="Resume">
                        <div className="text-resume">
                            <h3 id="title-resume">Du Même Auteur</h3>
                            <div className="same-author-books">
                                {Data.filter((b) => b.auteur === book.auteur && b.id !== book.id)
                                    .slice(0, 50)
                                    .map((b) => (
                                        <Card key={b.id} Book={b} onClick={() => handleCardClick(b)} />
                                    ))}
                                {/* Message si l'auteur n'a pas d'autres livres */}
                                {Data.filter((b) => b.auteur === book.auteur && b.id !== book.id)
                                    .length === 0 && (
                                    <p className="no-books-message">
                                        Aucun autre livre de cet auteur
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Resume