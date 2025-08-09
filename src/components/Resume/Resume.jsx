import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooksContext } from '../../contexts/BooksContext'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import Tags from '../Tags/Tags'
import Button from '../Button/Button'
import { X } from 'lucide-react'

function Resume({ book, onClose }) {
    const navigate = useNavigate()
    const { loadBookChapters, getBookChapters, isLoadingBook } = useBooksContext()

    const [lastChapterInfo, setLastChapterInfo] = useState(null)
    const [isVisible, setIsVisible] = useState(true)
    const [allChapters, setAllChapters] = useState([])

    // Chargement des chapitres avec le context
    useEffect(() => {
        const fetchChapters = async () => {
            // Vérifier d'abord le cache
            const cachedChapters = getBookChapters(book.id)
            if (cachedChapters) {
                updateChaptersList(cachedChapters)
                return
            }

            // Sinon charger
            const chapters = await loadBookChapters(book)
            updateChaptersList(chapters)
        }

        const updateChaptersList = (realChapters) => {
            if (realChapters.length > 0) {
                const chaptersList = realChapters.map((chapter, index) => ({
                    number: index,
                    title: chapter.title || `Chapitre ${index + 1}`
                }))
                setAllChapters(chaptersList)
            } else {
                // Fallback vers les chapitres génériques
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
            }
        }

        fetchChapters()
    }, [book, loadBookChapters, getBookChapters])

    // Le reste de ton code reste identique...
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

    const handleChapterClick = (chapterNumber) => {
        navigate(`/book/${book.id}`, {
            state: { book, chapterIndex: chapterNumber }
        })
    }

    const handleReadBook = () => {
        navigate(`/book/${book.id}`, { state: { book } })
    }

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    if (!isVisible) return null

    return (
        <section className="Section-Resume">
            <div className="Top-resume">
                <h2>{book.title}</h2>
                <X className="cross" size={20} onClick={handleClose} />
            </div>

            <div className="Resume">
                <div className="text-resume">
                    <h3 id="title-resume">Résumé</h3>
                    <p id="resume-book">{book.description}</p>
                </div>

                <div className="Resume-img">
                    <Card Book={book} onClick={undefined} />
                    <p>Total chapitres : {allChapters.length > 0 ? allChapters.length : book.chapters}</p>
                </div>

                <div className="Categorie">
                    {(Array.isArray(book.categorie)
                        ? book.categorie
                        : [book.categorie].filter(Boolean)
                    ).map((category, index) => (
                        <Tags key={index} text={category} />
                    ))}
                </div>

                <div className="chapter-available">
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
                                <Tags text={lastChapterInfo.chapterTitle.slice(0, 11)} />
                            </a>
                        ) : (
                            <Tags text={allChapters[0]?.title.slice(0, 11) || 'Chapitre 1'} />
                        )}
                    </div>

                    <div className="all-chapter">
                        <h4>Tous les chapitres :</h4>
                        {isLoadingBook(book.id) ? (
                            <div className="book-loading">
                                <div className="loading-bar">
                                    <div className="loading-progress"></div>
                                </div>
                            </div>
                        ) : (
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
                                        <Tags text={chapter.title.slice(0, 11)} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="Btn-start" onClick={handleReadBook}>
                <Button text={lastChapterInfo ? 'Continuer la lecture' : 'Commencer'} />
            </div>
        </section>
    )
}

export default Resume
