import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import StarRating from '../../components/StarRating/StarRating'
import Heart from '../Heart/Heart'
import ButtonRead from '../ButtonRead/ButtonRead'
import Tags from '../Tags/Tags'
import useLivres from '../../hooks/useLivres'
import { ArrowLeft } from 'lucide-react'

const SYNOPSIS_PREVIEW_LENGTH = 220

function Resume({ book, onClose, onSelectBook, phase = 'open' }) {
    const navigate = useNavigate()
    const { books } = useLivres()
    const [lastChapterInfo, setLastChapterInfo] = useState(null)
    const [expanded, setExpanded] = useState(false)

    // Dernier chapitre lu
    useEffect(() => {
        setExpanded(false)
        try {
            const saved = JSON.parse(localStorage.getItem(`book-${book.id}-lastChapterLink`))
            setLastChapterInfo(saved && typeof saved.chapterIndex === 'number' ? saved : null)
        } catch {
            setLastChapterInfo(null)
        }
    }, [book.id])

    const categories = (Array.isArray(book.categorie) ? book.categorie : [book.categorie]).filter(Boolean)

    const sameAuthorBooks = useMemo(
        () =>
            book.auteur
                ? books.filter((b) => b.auteur === book.auteur && b.id !== book.id).slice(0, 50)
                : [],
        [books, book.auteur, book.id]
    )

    const lastChapterTitle = lastChapterInfo?.chapterTitle
        ? lastChapterInfo.chapterTitle.replace('Introduction', 'Chapitre 0')
        : null

    const handleReadBook = () => {
        navigate(`/book/${book.id}`, { state: { book, chapterIndex: 0 } })
    }

    const handleResumeBook = () => {
        navigate(`/book/${book.id}`, {
            state: { book, chapterIndex: lastChapterInfo.chapterIndex }
        })
    }

    const handleSelectSameAuthor = (selected) => {
        if (onSelectBook) onSelectBook(selected)
        else navigate('/', { state: { fromEnding: true, book: selected } })
    }

    const classes = [
        'Section-Resume',
        phase === 'open' && 'visible',
        phase === 'closing' && 'closing'
    ]
        .filter(Boolean)
        .join(' ')

    const hasLongSynopsis = (book.description || '').length > SYNOPSIS_PREVIEW_LENGTH

    return (
        <section
            className={classes}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
        >
            <div className="Top-resume">
                <div className="resume-book">
                    {/* Barre du haut */}
                    <div className="icon-top-resume">
                        <button type="button" className="resume-back" onClick={onClose} aria-label="Fermer">
                            <ArrowLeft size={20} />
                        </button>
                        <Heart bookId={book.id} />
                    </div>

                    {/* Couverture + infos */}
                    <div className="info-resume">
                        <div className="Resume-img-book">
                            <img
                                src={book.cover}
                                alt={`Couverture de ${book.title}`}
                                className="img-book"
                            />
                        </div>

                        <div className="in-resume-book">
                            <h2 id="resume-title">{book.title}</h2>
                            {book.auteur && <p className="resume-author">par {book.auteur}</p>}

                            <div className="rating-wrapper">
                                <StarRating bookId={book.id} />
                            </div>

                            {categories.length > 0 && (
                                <div className="resume-tags">
                                    {categories.map((category) => (
                                        <Tags key={category} text={category} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="buttons-start">
                        {lastChapterInfo ? (
                            <>
                                <ButtonRead text="Reprendre" onClick={handleResumeBook} />
                                <ButtonRead
                                    text="Depuis le début"
                                    variant="default"
                                    onClick={handleReadBook}
                                />
                            </>
                        ) : (
                            <ButtonRead text="Lire" onClick={handleReadBook} />
                        )}
                    </div>
                    {lastChapterTitle && (
                        <p className="resume-last">Dernière lecture : {lastChapterTitle}</p>
                    )}

                    {/* Synopsis */}
                    {book.description && (
                        <div className="Resume">
                            <h3 className="resume-heading">Synopsis</h3>
                            <p className={`resume-synopsis${expanded ? ' is-expanded' : ''}`}>
                                {book.description}
                            </p>
                            {hasLongSynopsis && (
                                <button
                                    type="button"
                                    className="resume-more"
                                    aria-expanded={expanded}
                                    onClick={() => setExpanded((v) => !v)}
                                >
                                    {expanded ? 'Réduire' : 'Lire la suite'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Du même auteur */}
                    <div className="Resume">
                        <h3 className="resume-heading">Du même auteur</h3>
                        {sameAuthorBooks.length > 0 ? (
                            <div className="same-author-books">
                                {sameAuthorBooks.map((b) => (
                                    <Card
                                        key={b.id}
                                        Book={b}
                                        onClick={() => handleSelectSameAuthor(b)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="no-books-message">Aucun autre livre de cet auteur</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Resume