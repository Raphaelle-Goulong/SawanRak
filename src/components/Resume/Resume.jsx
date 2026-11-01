import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import StarRating from '../../components/StarRating/StarRating'
import Heart from '../Heart/Heart'
import ButtonRead from '../ButtonRead/ButtonRead'
import { ArrowLeft, BookOpen } from 'lucide-react'

function Resume({ book, onClose }) {
    const navigate = useNavigate()
    const [lastChapterInfo, setLastChapterInfo] = useState(null)
    const [isVisible, setIsVisible] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        // J'ai gardé ton fetch, mais tu devrais utiliser '/api/livres' en relatif !
        const fetchData = async () => {
            try {
                const response = await fetch('/api/livres')
                if (!response.ok) throw new Error('Erreur réseau')
                const json = await response.json()
                setData(json.livres || json)
            } catch (error) {
                console.error('Erreur de chargement des livres:', error)
            }
        }
        fetchData()
    }, [])

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

    const handleReadBook = () => {
        navigate(`/book/${book.id}`, { state: { book, chapterIndex: 0 } })
    }

    const handleResumeBook = () => {
        navigate(`/book/${book.id}`, {
            state: { book, chapterIndex: lastChapterInfo.chapterIndex }
        })
    }

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    const handleCardClick = (selectedBook) => {
        navigate('/', { state: { fromEnding: true, book: selectedBook } })
    }

    if (!isVisible) return null

    return (
        <section className="Section-Resume">
            <div className="Top-resume">
                <div className="resume-book">
                    {/* Barre du haut */}
                    <div className="icon-top-resume">
                        <ArrowLeft className="cross" size={26} onClick={handleClose} />
                        <Heart bookId={book.id} />
                    </div>

                    {/* Bloc principal : Cover + Infos */}
                    <div className="info-resume">
                        <div className="Resume-img-book">
                            <img src={book.cover} alt={book.title} className="img-book" />
                        </div>

                        <div className="in-resume-book">
                            <h2>{book.title}</h2>
                            <p id="author-name-resume">par {book.auteur}</p>
                            
                            <div className="rating-wrapper">
                                <StarRating bookId={book.id} />
                            </div>

                            <p id="gender-resume">
                                <BookOpen id="icon-book-open" size={16} />
                                {(Array.isArray(book.categorie) ? book.categorie : [book.categorie].filter(Boolean)).join(', ')}
                            </p>
                        </div>
                    </div>

                    {/* Boutons d'action (Lire / Reprendre) */}
                    <div className="buttons-start">
                        <div onClick={handleReadBook} className="btn-container">
                            <ButtonRead text="Lire" />
                        </div>
                        {lastChapterInfo && (
                            <div onClick={handleResumeBook} className="btn-container">
                                <ButtonRead text="Reprendre" />
                            </div>
                        )}
                    </div>

                    {/* Synopsis */}
                    <div className="Resume">
                        <div className="text-resume">
                            <h3 id="title-resume">Synopsis</h3>
                            <p id="resume-book">{book.description}</p>
                        </div>
                    </div>

                    {/* Du Même Auteur */}
                    <div className="Resume" id="resume-author">
                        <div className="text-resume">
                            <h3 id="title-resume">Du Même Auteur</h3>
                            <div className="same-author-books">
                                {data
                                    .filter((b) => b.auteur === book.auteur && b.id !== book.id)
                                    .slice(0, 50)
                                    .map((b) => (
                                        <Card key={b.id} Book={b} onClick={() => handleCardClick(b)} />
                                    ))}
                                {data.filter((b) => b.auteur === book.auteur && b.id !== book.id).length === 0 && (
                                    <p className="no-books-message">Aucun autre livre de cet auteur</p>
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