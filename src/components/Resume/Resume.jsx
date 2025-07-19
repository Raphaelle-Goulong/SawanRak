import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import Tags from '../Tags/Tags'
import Button from '../Button/Button'
import { X } from 'lucide-react'


function Resume({ book, onClose }) {
    // Hook pour la navigation entre pages
    const navigate = useNavigate()
    
    // État pour stocker les infos du dernier chapitre lu
    const [lastChapterInfo, setLastChapterInfo] = useState(null)
    
    // État pour gérer la visibilité du composant
    const [isVisible, setIsVisible] = useState(true)
    
    // État pour stocker la liste de tous les chapitres
    const [allChapters, setAllChapters] = useState([])

    // Effet qui s'exécute au montage et quand book.id ou book.chapters change
    useEffect(() => {
        // 1. Récupération du dernier chapitre lu depuis le localStorage
        const savedInfo = localStorage.getItem(`book-${book.id}-lastChapterLink`)
        if (savedInfo) {
            setLastChapterInfo(JSON.parse(savedInfo))
        }

        // 2. Création de la liste des chapitres
        const chaptersList = []
        for (let i = 1; i <= book.chapters; i++) {
            chaptersList.push({
                number: i,         // Numéro du chapitre (commence à 1)
                title: `Chapitre ${i}` // Titre formaté
            })
        }
        setAllChapters(chaptersList)
    }, [book.id, book.chapters]) 

    // Handler pour clic sur un chapitre
    const handleChapterClick = (chapterNumber) => {
        navigate(`/book/${book.id}`, {
            state: {
                book,
                chapterIndex: chapterNumber - 1 // Conversion en index (commence à 0)
            }
        })
    }

    // Handler pour le bouton "Lire"
    const handleReadBook = () => {
        navigate(`/book/${book.id}`, { state: { book } })
    }

    // Handler pour fermer le composant
    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose() // Appelle la prop onClose si elle existe
    }

    // Si le composant est invisible, on ne rend rien
    if (!isVisible) {
        return null
    }

    
    return (
        <section className="Section-Resume">
            {/* En-tête avec titre et bouton fermer */}
            <div className="Top-resume">
                <h2>{book.title}</h2>
                <X className="cross" size={20} onClick={handleClose} />
            </div>

            {/* Contenu principal */}
            <div className="Resume">
                {/* Section résumé texte */}
                <div className="text-resume">
                    <h3 id="title-resume">Résumé</h3>
                    <p id="resume-book">{book.description}</p>
                </div>

                {/* Image de couverture + nombre de chapitres */}
                <div className="Resume-img">
                    <Card Book={book} onClick={undefined} />
                    <p>Total chapitres : {book.chapters}</p>
                </div>

                {/* Liste des catégories */}
                <div className="Categorie">
                    {/* Gère à la fois les catégories sous forme de string ou d'array */}
                    {(Array.isArray(book.categorie)
                        ? book.categorie
                        : [book.categorie].filter(Boolean)
                    ).map((category, index) => (
                        <Tags key={index} text={category} />
                    ))}
                </div>

                {/* Section des chapitres */}
                <div className="chapter-available">
                    {/* Dernier chapitre lu */}
                    <div className="last-chapter">
                        <h4 id="last-chap">Dernier chapitre lu : </h4>
                        {lastChapterInfo ? (
                            // Si un chapitre a été sauvegardé
                            <a
                                href={`/book/${book.id}?chapter=${lastChapterInfo.chapterIndex}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleChapterClick(lastChapterInfo.chapterIndex + 1)
                                }}
                                className="chapter-link">
                                <Tags text={lastChapterInfo.chapterTitle} />
                            </a>
                        ) : (
                            // Sinon affiche le chapitre 1 par défaut
                            <Tags text={`Chapitre ${book.lastChapter || 1}`} />
                        )}
                    </div>

                    {/* Liste de tous les chapitres */}
                    <div className="all-chapter">
                        <h4>Tous les chapitres :</h4>
                        <div className="chapters-list">
                            {allChapters.map((chapter) => (
                                // Lien cliquable pour chaque chapitre
                                <a
                                    key={chapter.number}
                                    href={`/book/${book.id}?chapter=${chapter.number - 1}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleChapterClick(chapter.number)
                                    }}
                                    className="chapter-link">
                                    <Tags text={chapter.title} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="Btn-start" onClick={handleReadBook}>
                {/* Change le texte selon si on a un historique de lecture */}
                <Button text={lastChapterInfo ? 'Continuer la lecture' : 'Commencer'} />
            </div>
        </section>
    )
}

export default Resume