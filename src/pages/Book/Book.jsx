import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useBooksContext } from '../../contexts/BooksContext'
import ChaptersDropdown from '../../components/ChaptersDropdown/ChaptersDropdown'
import Button from '../../components/Button/Button'
import Ending from '../../components/Ending/Ending'
import '../Book/Book.scss'
import Loading from '../../components/Loading/Loading'

function Book() {
    const { state } = useLocation()
    const { loadBookChapters, getBookChapters, isLoadingBook } = useBooksContext()
    const [initialLoading, setInitialLoading] = useState(true)
    const book = state?.book || {
        title: 'Titre par défaut',
        chapters: 1,
        url: ''
    }

    const [chapters, setChapters] = useState([])
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
    const [error, setError] = useState(null)
    const [showEndingModal, setShowEndingModal] = useState(false)

    const handleNextChapter = () => {
        if (currentChapterIndex === chapters.length - 1) {
            setShowEndingModal(true)
        } else {
            handleSelectChapter(currentChapterIndex + 1)
        }
    }

    // Effet pour le chargement initial de 2 secondes
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    //  Remplacer tout le useEffect de chargement par celui-ci
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                // Vérifier d'abord le cache
                const cachedChapters = getBookChapters(book.id)
                if (cachedChapters) {
                    setChapters(cachedChapters)
                    return
                }

                // Sinon charger via le Context
                const loadedChapters = await loadBookChapters(book)
                setChapters(loadedChapters)
            } catch (err) {
                setError(err.message)
                console.error('Erreur de chargement:', err)
            }
        }

        if (book.url) {
            fetchChapters()
        }
    }, [book, loadBookChapters, getBookChapters])

    useEffect(() => {
        if (book.id) {
            const savedProgress = localStorage.getItem(`book-${book.id}-progress`)
            const initialChapter =
                state?.chapterIndex !== undefined
                    ? state.chapterIndex
                    : savedProgress
                    ? parseInt(savedProgress, 10)
                    : 0

            setCurrentChapterIndex(initialChapter)
        }
    }, [book.id, state?.chapterIndex])

    const handleSelectChapter = (index) => {
        setCurrentChapterIndex(index)
        window.scrollTo(0, 0)

        if (book.id) {
            localStorage.setItem(`book-${book.id}-progress`, index.toString())
            localStorage.setItem(
                `book-${book.id}-lastChapterLink`,
                JSON.stringify({
                    chapterIndex: index,
                    chapterTitle: chapters[index]?.title || `Chapitre ${index + 1}`,
                    timestamp: Date.now()
                })
            )
        }
    }

    // Afficher le loading initial pendant 2 secondes
    if (initialLoading) {
        return (
            <div className="loading">
                <Loading />
            </div>
        )
    }

    //  Utiliser le loading du Context
    if (isLoadingBook(book.id))
        return (
            <div className="loading">
                <Loading />
            </div>
        )
    if (error) return <div className="error">{error}</div>

   return (
    <section className="Section-Book">
        <div className="Book">

            {/* Header : titre du livre + progression */}
            <header className="book-header">
                <h1 className="book-title">{book.title}</h1>
                <img
                                src={book.cover}
                                alt={`Couverture de ${book.title}`}
                                className="img-book"
                            />
                <div className="book-progress">
                    <div className="book-progress__bar">
                        <div
                            className="book-progress__fill"
                            style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
                        />
                    </div>
                    <span className="book-progress__label">
                        {currentChapterIndex + 1} / {chapters.length}
                    </span>
                </div>
            </header>

            {/* Sélecteur de chapitre */}
            <div className="top-book">
                <ChaptersDropdown
                    items={chapters.map((chap, i) => ({
                        id: i,
                        number: i > 0 && i < chapters.length - 1 ? String(i) : '',
                        label: chap.title || `Chapitre ${i + 1}`
                    }))}
                    selectedId={currentChapterIndex}
                    onSelect={handleSelectChapter}
                />
            </div>

            {/* Corps du chapitre */}
            <div className="Text-Book">
                <h2 className="chapter-title">
                    {chapters[currentChapterIndex]?.title || `Chapitre ${currentChapterIndex + 1}`}
                </h2>
                <div className="chapter-divider" aria-hidden="true" />

                <div className="chapter-content">
                    {chapters[currentChapterIndex]?.content
                        .split('\n\n')
                        .map((para, i) => <p key={i}>{para}</p>)
                    }
                </div>
            </div>
        </div>

        {/* Navigation */}
        <div className="btn-next">
            <Button
                onClick={() => handleSelectChapter(Math.max(0, currentChapterIndex - 1))}
                disabled={currentChapterIndex === 0}
            >
                Précédent
            </Button>
            <Button onClick={handleNextChapter}>
                Suivant
            </Button>
        </div>

        {/* Modal de fin */}
        {showEndingModal && (
            <div
                className="modal-overlay"
                onClick={() => setShowEndingModal(false)}
            >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Ending onClose={() => setShowEndingModal(false)} book={book} />
                </div>
            </div>
        )}
    </section>
)

}

export default Book
