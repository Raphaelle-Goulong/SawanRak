import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import '../Home/Home.scss'

import Card from '../../components/Card/Card'
import Categories from '../../components/Sort/Categories/Categories'
import Resume from '../../components/Resume/Resume'
import TagsNavigation from '../../components/TagsNavigation/TagsNavigation'
import CardDaily from '../../components/CardDaily/CardDaily'
import ButtonRead from '../../components/ButtonRead/ButtonRead'
import Loading from '../../components/Loading/Loading'
import useLivres from '../../hooks/useLivres'

const VIEWED_KEY = 'lastViewedBooks'
const MAX_VIEWED = 10
const DAILY_COUNT = 5
const MODAL_CLOSE_MS = 300

// ── Utilitaires ──
const readViewedIds = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(VIEWED_KEY))
        return Array.isArray(stored) ? stored : []
    } catch {
        return []
    }
}

const readLastChapterTitle = (bookId) => {
    try {
        const info = JSON.parse(localStorage.getItem(`book-${bookId}-lastChapterLink`))
        return info?.chapterTitle || null
    } catch {
        return null
    }
}

// Générateur pseudo-aléatoire reproductible : mêmes livres toute la journée
const seededRandom = (seed) => {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
    return () => {
        h = (h + 0x6d2b79f5) | 0
        let t = Math.imul(h ^ (h >>> 15), 1 | h)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const pickDailyBooks = (books) => {
    const random = seededRandom(new Date().toDateString())
    const shuffled = [...books]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        const tmp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = tmp
    }
    return shuffled.slice(0, DAILY_COUNT)
}

function Home({ onBookSelectFromSearch }) {
    const location = useLocation()
    const { books, status, isLoading } = useLivres()

    const [activeTag, setActiveTag] = useState('last-viewed')
    const [viewedIds, setViewedIds] = useState(readViewedIds)

    // Fiche du livre : 'closed' | 'opening' | 'open' | 'closing'
    const [modal, setModal] = useState({ book: null, phase: 'closed' })

    // ── Données dérivées ──
    const lastViewedBooks = useMemo(
        () =>
            viewedIds
                .map((id) => books.find((book) => book.id === id))
                .filter(Boolean)
                .slice(0, MAX_VIEWED),
        [viewedIds, books]
    )

    const recentBooks = useMemo(
        () => [...books].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
        [books]
    )

    const dailyBooks = useMemo(() => pickDailyBooks(books), [books])

    const lastBook = lastViewedBooks[0]
    const lastChapterTitle = useMemo(
        () => (lastBook ? readLastChapterTitle(lastBook.id) : null),
        [lastBook]
    )

    // ── Ouverture / fermeture de la fiche ──
    const openBook = (book) => {
        const next = [book.id, ...readViewedIds().filter((id) => id !== book.id)].slice(0, MAX_VIEWED)
        try {
            localStorage.setItem(VIEWED_KEY, JSON.stringify(next))
        } catch {
            /* stockage indisponible : on ignore */
        }
        setViewedIds(next)
        setModal({ book, phase: 'opening' })
    }

    const closeBook = () => {
        setModal((m) => (m.book ? { ...m, phase: 'closing' } : m))
    }

    // opening → open (laisse le navigateur peindre l'état de départ avant la transition)
    useEffect(() => {
        if (modal.phase !== 'opening') return undefined
        const timer = setTimeout(() => {
            setModal((m) => (m.phase === 'opening' ? { ...m, phase: 'open' } : m))
        }, 30)
        return () => clearTimeout(timer)
    }, [modal.phase])

    // closing → closed
    useEffect(() => {
        if (modal.phase !== 'closing') return undefined
        const timer = setTimeout(() => setModal({ book: null, phase: 'closed' }), MODAL_CLOSE_MS)
        return () => clearTimeout(timer)
    }, [modal.phase])

    // Échap ferme la fiche, et la page derrière ne défile plus
    useEffect(() => {
        if (!modal.book) return undefined

        const onKey = (e) => {
            if (e.key === 'Escape') closeBook()
        }
        const previousOverflow = document.body.style.overflow

        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
        }
    }, [modal.book])

    // Livre choisi depuis la recherche
    useEffect(() => {
        if (!onBookSelectFromSearch) return undefined
        const timer = setTimeout(() => openBook(onBookSelectFromSearch), 400)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onBookSelectFromSearch])

    // Livre suggéré depuis la fin d'un livre
    useEffect(() => {
        if (location.state?.fromEnding && location.state?.book) {
            openBook(location.state.book)
            window.history.replaceState({}, document.title)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state])

    // ── Rendu des sections ──
    const renderDaily = () => (
        <section className="home-section">
            <header className="home-section__head">
                <h2>Découvertes du jour</h2>
                <p>Quelques livres choisis pour toi aujourd'hui</p>
            </header>
            <div className="daily-grid">
                {dailyBooks.map((book) => (
                    <CardDaily key={`daily-${book.id}`} Book={book} onClick={openBook} />
                ))}
            </div>
        </section>
    )

    const renderContent = () => {
        if (status === 'error') {
            return <p className="home-empty">Impossible de charger les livres pour le moment.</p>
        }

        if (activeTag === 'last-viewed') {
            return (
                <>
                    <section className="home-section">
                        <header className="home-section__head">
                            <h2>Dernier livre consulté</h2>
                        </header>

                        {lastBook ? (
                            <div className="last-book">
                                <Card Book={lastBook} onClick={() => openBook(lastBook)} />
                                <div className="last-book__info">
                                    <p className="last-book__title">{lastBook.title}</p>
                                    {lastBook.auteur && (
                                        <p className="last-book__meta">par {lastBook.auteur}</p>
                                    )}
                                    {lastChapterTitle && (
                                        <p className="last-book__meta">
                                            Tu en étais à « {lastChapterTitle} »
                                        </p>
                                    )}
                                    <ButtonRead text="Reprendre" onClick={() => openBook(lastBook)} />
                                </div>
                            </div>
                        ) : (
                            <p className="home-empty">Aucun livre consulté récemment</p>
                        )}
                    </section>
                    {renderDaily()}
                </>
            )
        }

        if (activeTag === 'recent') {
            return (
                <>
                    <section className="home-section">
                        <header className="home-section__head">
                            <h2>Récents ajouts</h2>
                        </header>
                        <div className="recent-grid">
                            {recentBooks.map((book) => (
                                <Card key={book.id} Book={book} onClick={() => openBook(book)} />
                            ))}
                        </div>
                    </section>
                    {renderDaily()}
                </>
            )
        }

        const browseFilters = { categories: 'Categories', authors: 'Author', all: 'All' }
        if (browseFilters[activeTag]) {
            return (
                <section className="Home-Books-section">
                    <div className="Home-Books">
                        <Categories filterType={browseFilters[activeTag]} onCardClick={openBook} />
                    </div>
                </section>
            )
        }

        return null
    }

    if (isLoading) {
        return (
            <div className="home-loading">
                <Loading />
            </div>
        )
    }

    return (
        <section className="Section-Home">
            <div className="Home">
                <TagsNavigation activeTag={activeTag} onTagClick={setActiveTag} />

                {/* key : l'apparition se rejoue à chaque changement d'onglet */}
                <div className="dynamic-content" key={activeTag}>
                    {renderContent()}
                </div>
            </div>

            {modal.book && (
                <div
                    className={`resume-modal-overlay${modal.phase === 'open' ? ' show' : ''}`}
                    onClick={closeBook}
                >
                    <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
                        <Resume
                            key={modal.book.id}
                            book={modal.book}
                            phase={modal.phase}
                            onClose={closeBook}
                            onSelectBook={openBook}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}

export default Home