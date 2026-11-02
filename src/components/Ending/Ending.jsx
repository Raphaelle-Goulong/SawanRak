import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../Ending/Ending.scss'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import StarRating from '../../components/StarRating/StarRating'
import { X } from 'lucide-react'

const SUGGESTIONS_COUNT = 3

const toArray = (value) => (Array.isArray(value) ? value : [value])

function Ending({ onClose, book }) {
    const location = useLocation()
    const navigate = useNavigate()

    // Le livre arrive en prop depuis la page Book ; on garde l'état de la route en secours
    const currentBook = book || location.state?.book

    const [allBooks, setAllBooks] = useState([])
    const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

    // Garde la dernière version de onClose sans relancer les effets
    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    // Charge la liste des livres
    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            try {
                const response = await fetch('/api/livres', { signal: controller.signal })
                if (!response.ok) throw new Error('Erreur réseau')
                const json = await response.json()
                setAllBooks(json.livres || json)
                setStatus('ready')
            } catch (error) {
                if (error.name === 'AbortError') return
                console.error('Erreur de chargement des livres:', error)
                setStatus('error')
            }
        }

        fetchData()
        return () => controller.abort()
    }, [])

    // Échap ferme la fenêtre, et la page derrière ne défile plus
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onCloseRef.current?.()
        }
        const previousOverflow = document.body.style.overflow

        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
        }
    }, [])

    // Livres similaires : même (première) catégorie, tirés au hasard
    const similarBooks = useMemo(() => {
        if (!currentBook?.categorie || allBooks.length === 0) return []

        const firstCategory = toArray(currentBook.categorie)[0]
        const sameCategory = allBooks.filter(
            (b) => b.id !== currentBook.id && toArray(b.categorie).includes(firstCategory)
        )

        return [...sameCategory].sort(() => 0.5 - Math.random()).slice(0, SUGGESTIONS_COUNT)
    }, [currentBook, allBooks])

   

    // Clic sur un livre suggéré : retour à l'accueil avec ouverture de sa fiche
    const handleBookClick = (suggested) => {
        navigate('/', {
            state: {
                fromEnding: true,
                book: suggested
            }
        })
    }

    const handleGoHome = () => {
        onClose?.()
        navigate('/')
    }

    return (
        <section
            className="Section-Ending"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ending-title"
        >
            <button type="button" className="ending-close" onClick={onClose} aria-label="Fermer">
                <X size={18} />
            </button>

            <header className="ending-head">
                <p className="ending-eyebrow">Tu es arrivée à la fin du livre</p>
                <h2 className="ending-title" id="ending-title">Bye bye !</h2>
                {currentBook?.title && <p className="ending-book">{currentBook.title}</p>}
            </header>

            <div className="ending-rate">
                <h3 className="ending-label">N'oublie pas de noter</h3>
                <StarRating bookId={currentBook?.id} size="lg" />
            </div>

            <div className="ending-similar">
                <h3 className="ending-label">Livre qui pourrait te plaire</h3>

                <div className="ending-books">
                    {status === 'loading' ? (
                        <div className="ending-books__track" aria-hidden="true">
                            {Array.from({ length: SUGGESTIONS_COUNT }, (_, i) => (
                                <div key={i} className="ending-skeleton" />
                            ))}
                        </div>
                    ) : similarBooks.length > 0 ? (
                        <div className="ending-books__track">
                            {similarBooks.map((suggested) => (
                                <Card
                                    key={suggested.id}
                                    Book={suggested}
                                    onClick={() => handleBookClick(suggested)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="ending-empty">Aucune suggestion disponible</p>
                    )}
                </div>
            </div>

            <div className="ending-actions">
                <Button variant="primary" onClick={handleGoHome}>
                    Retour à l'accueil
                </Button>
            </div>
        </section>
    )
}

export default Ending