import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useBooksContext } from '../../contexts/BooksContext'
import ChaptersDropdown from '../../components/ChaptersDropdown/ChaptersDropdown'
import Button from '../../components/Button/Button'
import Ending from '../../components/Ending/Ending'
import '../Book/Book.scss'
import Loading from '../../components/Loading/Loading'

// Durée minimale d'affichage du loader à l'ouverture d'un livre (en ms)
const INITIAL_LOADING_MS = 2500

// ── Réglages de lecture (mémorisés d'une visite à l'autre) ──
const READER_SCALES = [0.9, 1, 1.12, 1.25, 1.4]
const READER_STORAGE_KEY = 'glandia_reader'
const DEFAULT_READER = { size: 1, font: 'sans' }
const WORDS_PER_MINUTE = 200

const loadReaderPrefs = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(READER_STORAGE_KEY))
        const validSize =
            Number.isInteger(saved?.size) && saved.size >= 0 && saved.size < READER_SCALES.length
        return {
            size: validSize ? saved.size : DEFAULT_READER.size,
            font: saved?.font === 'serif' ? 'serif' : 'sans'
        }
    } catch {
        return DEFAULT_READER
    }
}

function Book() {
    const { state } = useLocation()

    const { loadBookChapters, getBookChapters, isLoadingBook, saveChapterCorrection } =
        useBooksContext()

    const [initialLoading, setInitialLoading] = useState(true)

    // Édition d'un chapitre
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState('')

    // Réglages de lecture + notification
    const [reader, setReader] = useState(loadReaderPrefs)
    const [toast, setToast] = useState(null)

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

    // Loader minimum à l'ouverture
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false)
        }, INITIAL_LOADING_MS)

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

    // Mémorise les réglages de lecture
    useEffect(() => {
        try {
            localStorage.setItem(READER_STORAGE_KEY, JSON.stringify(reader))
        } catch {
            /* stockage indisponible : on ignore */
        }
    }, [reader])

    // La notification disparaît toute seule
    useEffect(() => {
        if (!toast) return undefined
        const timer = setTimeout(() => setToast(null), 2800)
        return () => clearTimeout(timer)
    }, [toast])

    // Progression du défilement : alimente la ligne en haut de l'écran
    // (écrite sur <html>, donc sans re-render React)
    useEffect(() => {
        const root = document.documentElement
        let raf = 0

        const update = () => {
            raf = 0
            const max = root.scrollHeight - window.innerHeight
            const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
            root.style.setProperty('--read', p.toFixed(4))
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            if (raf) cancelAnimationFrame(raf)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            root.style.removeProperty('--read')
        }
    }, [])

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

    const changeSize = (delta) =>
        setReader((r) => ({
            ...r,
            size: Math.min(READER_SCALES.length - 1, Math.max(0, r.size + delta))
        }))

    const changeFont = (font) => setReader((r) => ({ ...r, font }))

    // Sauvegarde d'une correction
    const handleSaveCorrection = async () => {
        try {
            const success = await saveChapterCorrection(book.id, currentChapterIndex, editedContent)
            if (success) {
                // Mettre à jour l'affichage local
                const updatedChapters = [...chapters]
                updatedChapters[currentChapterIndex].content = editedContent
                setChapters(updatedChapters)
                setIsEditing(false)
                setToast({ type: 'success', text: 'Texte sauvegardé sur le NAS' })
            } else {
                setToast({ type: 'error', text: 'Erreur de sauvegarde' })
            }
        } catch (err) {
            console.error('Erreur de sauvegarde:', err)
            setToast({ type: 'error', text: 'Erreur de sauvegarde' })
        }
    }

    if (initialLoading) {
        return (
            <div className="loading">
                <Loading />
            </div>
        )
    }

    if (isLoadingBook(book.id)) {
        return (
            <div className="loading">
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className="book-error" role="alert">
                <h2>Impossible de charger ce livre</h2>
                <p>{error}</p>
            </div>
        )
    }

    // ── Données dérivées du chapitre en cours ──
    const currentChapter = chapters[currentChapterIndex]
    const content = currentChapter?.content || ''
    const paragraphs = content.split('\n\n').filter((p) => p.trim())
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const readingMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
    const progress = chapters.length ? ((currentChapterIndex + 1) / chapters.length) * 100 : 0

    return (
        <section
            className="Section-Book"
            data-font={reader.font}
            style={{ '--reading-scale': READER_SCALES[reader.size] }}>
            <div className="read-progress" aria-hidden="true" />

            <div className="Book">
                <header className="book-header">
                    <img
                        src={book.cover}
                        alt={`Couverture de ${book.title}`}
                        className="img-book"
                    />
                    <div className="book-header__info">
                        <p className="book-header__eyebrow">Lecture en cours</p>
                        <h1 className="book-title">{book.title}</h1>
                        {/* Adapte le nom du champ si ton JSON utilise "auteur" */}
                        {book.author && <p className="book-author">{book.author}</p>}
                        <div className="book-progress">
                            <div className="book-progress__bar">
                                <div
                                    className="book-progress__fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="book-progress__label">
                                {currentChapterIndex + 1} / {chapters.length}
                            </span>
                        </div>
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

                <div className="reader-tools" role="toolbar" aria-label="Réglages de lecture">
                    <div className="reader-tools__group">
                        <button
                            type="button"
                            onClick={() => changeSize(-1)}
                            disabled={reader.size === 0}
                            aria-label="Réduire la taille du texte">
                            A−
                        </button>
                        <button
                            type="button"
                            onClick={() => changeSize(1)}
                            disabled={reader.size === READER_SCALES.length - 1}
                            aria-label="Agrandir la taille du texte">
                            A+
                        </button>
                    </div>
                    <div className="reader-tools__group">
                        <button
                            type="button"
                            className={reader.font === 'sans' ? 'is-active' : ''}
                            aria-pressed={reader.font === 'sans'}
                            onClick={() => changeFont('sans')}>
                            Moderne
                        </button>
                        <button
                            type="button"
                            className={reader.font === 'serif' ? 'is-active' : ''}
                            aria-pressed={reader.font === 'serif'}
                            onClick={() => changeFont('serif')}>
                            Classique
                        </button>
                    </div>
                </div>

                <div className="Text-Book" lang="fr">
                    <div className="chapter-head">
                        <p className="chapter-eyebrow">≈ {readingMinutes} min de lecture</p>
                        <h2 className="chapter-title">
                            {currentChapter?.title || `Chapitre ${currentChapterIndex + 1}`}
                        </h2>
                        <div className="chapter-divider" aria-hidden="true" />
                    </div>

                    <div className="chapter-content">
                        {isEditing ? (
                            <div className="chapter-editor">
                                <textarea
                                    className="chapter-editor__textarea"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                                <div className="chapter-editor__actions">
                                    <Button onClick={() => setIsEditing(false)}>Annuler</Button>
                                    <Button onClick={handleSaveCorrection}>💾 Sauvegarder</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {paragraphs.map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}

                                <div className="chapter-edit-trigger">
                                    <Button
                                        onClick={() => {
                                            setEditedContent(content)
                                            setIsEditing(true)
                                        }}>
                                        ✏️ Modifier ce chapitre
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="btn-next">
                <Button
                    variant="primary"
                    onClick={() => handleSelectChapter(Math.max(0, currentChapterIndex - 1))}
                    disabled={currentChapterIndex === 0}>
                    Précédent
                </Button>
                <Button variant="primary" onClick={handleNextChapter}>
                    Suivant
                </Button>
            </div>

            {showEndingModal && (
                <div className="modal-overlay" onClick={() => setShowEndingModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <Ending onClose={() => setShowEndingModal(false)} book={book} />
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast toast--${toast.type}`} role="status">
                    {toast.text}
                </div>
            )}
        </section>
    )
}

export default Book
