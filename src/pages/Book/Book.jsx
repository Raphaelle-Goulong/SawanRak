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
    
    // 1. On ajoute saveChapterCorrection ici
    const { loadBookChapters, getBookChapters, isLoadingBook, saveChapterCorrection } = useBooksContext()
    
    const [initialLoading, setInitialLoading] = useState(true)
    
    // 2. Nouveaux états pour l'édition
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState('')

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

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const cachedChapters = getBookChapters(book.id)
                if (cachedChapters) {
                    setChapters(cachedChapters)
                    return
                }

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
        setIsEditing(false) // On annule l'édition si on change de chapitre
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

    // 3. La fonction pour sauvegarder
    const handleSaveCorrection = async () => {
        const success = await saveChapterCorrection(book.id, currentChapterIndex, editedContent);
        if (success) {
            // Mettre à jour l'affichage local
            const updatedChapters = [...chapters];
            updatedChapters[currentChapterIndex].content = editedContent;
            setChapters(updatedChapters);
            setIsEditing(false);
            alert('Texte sauvegardé sur le NAS !');
        } else {
            alert('Erreur de sauvegarde');
        }
    }

    if (initialLoading) {
        return (
            <div className="loading">
                <Loading />
            </div>
        )
    }

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

                <div className="Text-Book">
                    <h2 className="chapter-title">
                        {chapters[currentChapterIndex]?.title || `Chapitre ${currentChapterIndex + 1}`}
                    </h2>
                    <div className="chapter-divider" aria-hidden="true" />

                    {/* 4. Le bloc modifié pour l'édition */}
                    <div className="chapter-content">
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        minHeight: '400px', 
                                        padding: '1rem',
                                        fontSize: '1rem',
                                        lineHeight: '1.6',
                                        fontFamily: 'inherit'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button onClick={() => setIsEditing(false)}>Annuler</Button>
                                    <Button onClick={handleSaveCorrection}>💾 Sauvegarder</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {chapters[currentChapterIndex]?.content
                                    .split('\n\n')
                                    .map((para, i) => <p key={i}>{para}</p>)
                                }
                                <div style={{ marginTop: '2rem' }}>
                                    <Button onClick={() => {
                                        setEditedContent(chapters[currentChapterIndex]?.content || '');
                                        setIsEditing(true);
                                    }}>✏️ Modifier ce chapitre</Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

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