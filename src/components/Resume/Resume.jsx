import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import Tags from '../Tags/Tags'
import Button from '../Button/Button'
import { X } from 'lucide-react'

function Resume({ book, onClose }) {
    const navigate = useNavigate()
    const [lastChapterInfo, setLastChapterInfo] = useState(null)
    const [isVisible, setIsVisible] = useState(true)
    const [allChapters, setAllChapters] = useState([])

    // 1. Chargement du dernier chapitre (séparé)
    useEffect(() => {
        const savedInfo = localStorage.getItem(`book-${book.id}-lastChapterLink`)
        if (savedInfo) {
            const info = JSON.parse(savedInfo)
            setLastChapterInfo({
                ...info,
                chapterTitle: info.chapterTitle.replace('Introduction', 'Chapitre 0')
            })
        }
    }, [book.id])

    // 2. Génération des chapitres (séparé)
    useEffect(() => {
        const startsWithZero = book.description?.toLowerCase().includes('intro')
        const chaptersList = []

        if (startsWithZero) {
            chaptersList.push({ number: 0, title: 'Chapitre 0' })
        }

        for (let i = 1; i <= book.chapters; i++) {
            chaptersList.push({
                number: startsWithZero ? i : i - 1,
                title: `Chapitre ${i}`
            })
        }

        setAllChapters(chaptersList)
    }, [book.chapters, book.description])

    // Handler pour clic sur un chapitre
    const handleChapterClick = (chapterNumber) => {
        navigate(`/book/${book.id}`, {
            state: {
                book,
                chapterIndex: chapterNumber // Plus besoin de -1 car on gère déjà l'index
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
                            <a
                                href={`/book/${book.id}?chapter=${lastChapterInfo.chapterIndex}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleChapterClick(lastChapterInfo.chapterIndex)
                                }}
                                className="chapter-link">
                                <Tags text={lastChapterInfo.chapterTitle} />
                            </a>
                        ) : (
                            <Tags text={allChapters[0]?.title || 'Chapitre 1'} />
                        )}
                    </div>

                    {/* Liste de tous les chapitres */}
                    <div className="all-chapter">
                        <h4>Tous les chapitres :</h4>
                        <div className="chapters-list">
                            {allChapters.map((chapter) => (
                                <a
                                    key={chapter.number}
                                    href={`/book/${book.id}?chapter=${chapter.number}`}
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
