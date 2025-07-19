import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import mammoth from 'mammoth'
import ChaptersDropdown from '../../components/ChaptersDropdown/ChaptersDropdown'
import Button from '../../components/Button/Button'
import Ending from '../../components/Ending/Ending'
import '../Book/Book.scss'
import Loading from '../../components/Loading/Loading'

function Book() {
    const { state } = useLocation()
    const book = state?.book || {
        title: 'Titre par défaut',
        chapters: 1,
        url: ''
    }

    const [chapters, setChapters] = useState([])
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [showEndingModal, setShowEndingModal] = useState(false)

    const handleNextChapter = () => {
        if (currentChapterIndex === chapters.length - 1) {
            // Si on est déjà au dernier chapitre
            setShowEndingModal(true) // Affiche la modale
        } else {
            // Sinon, passe au chapitre suivant normalement
            handleSelectChapter(currentChapterIndex + 1)
        }
    }
    useEffect(() => {
        const fetchBookContent = async () => {
            try {
                const response = await fetch(book.url)
                const arrayBuffer = await response.arrayBuffer()

                const result = await mammoth.extractRawText({ arrayBuffer })
                const extractedChapters = convertToJsonStructure(result.value)

                setChapters(extractedChapters)
            } catch (err) {
                setError(err.message)
                console.error('Erreur de chargement:', err)
            } finally {
                setIsLoading(false)
            }
        }

        if (book.url) fetchBookContent()
    }, [book.url])

    useEffect(() => {
        if (book.id) {
            // Récupérer la progression sauvegardée
            const savedProgress = localStorage.getItem(`book-${book.id}-progress`)

            // Vérifier si un chapitre spécifique est passé dans le state de navigation
            const initialChapter =
                state?.chapterIndex || (savedProgress ? parseInt(savedProgress, 10) : 0)

            setCurrentChapterIndex(initialChapter)
        }
    }, [book.id, state?.chapterIndex])

    const convertToJsonStructure = (content) => {
    const paragraphs = content.split('\n')
    const chapters = []
    let currentChapter = { title: '', content: '' }
    let hasChapterZero = false

    paragraphs.forEach((paragraph) => {
        const trimmed = paragraph.trim()

        // Détection du chapitre 0
        if (trimmed.match(/^chapitre 0|^chapter 0|^introduction/i)) {
            hasChapterZero = true
            if (currentChapter.title || currentChapter.content) {
                chapters.push({ ...currentChapter })
            }
            currentChapter = {
                title: 'Chapitre 0', // Standardisation du nom
                content: ''
            }
        } 
        // Détection des autres chapitres
        else if (trimmed.match(/^chapitre|^chapter/i)) {
            if (currentChapter.title || currentChapter.content) {
                chapters.push({ ...currentChapter })
            }
            currentChapter = {
                title: trimmed,
                content: ''
            }
        } else if (trimmed) {
            currentChapter.content += trimmed + '\n\n'
        }
    })

    if (currentChapter.title || currentChapter.content) {
        chapters.push(currentChapter)
    }

    return chapters
}

    const handleSelectChapter = (index) => {
        setCurrentChapterIndex(index)
        window.scrollTo(0, 0)
        // Sauvegarde la progression et le lien du chapitre
        if (book.id) {
            localStorage.setItem(`book-${book.id}-progress`, index.toString())
            localStorage.setItem(
                `book-${book.id}-lastChapterLink`,
                JSON.stringify({
                    chapterIndex: index,
                    chapterTitle: chapters[index]?.title || `Chapitre ${index + 1}`
                })
            )
        }
    }

    if (isLoading) return <div className="loading"> <Loading/></div>
    if (error) return <div className="error">{error}</div>

    return (
        <section className="Section-Book">
            <div className="Book">
                <div className="title-book">
                    <h2>{book.title}</h2>
                </div>

                <div className="top-book">
                    <ChaptersDropdown
                        items={chapters.map((chap, i) => ({
                            id: i, // L'ID doit correspondre à l'index du chapitre
                            label: chap.title || `Chapitre ${i + 1}`
                        }))}
                        selectedId={currentChapterIndex} // Doit être l'index actuel
                        onSelect={(id) => {
                            setCurrentChapterIndex(id)
                            localStorage.setItem(`progress-${id}`, id)
                        }}
                    />
                    {/* <span>Chapitre {currentChapterIndex + 1}/{chapters.length}</span> */}
                </div>

                <div className="Text-Book">
                    <h2 className="chapter-title">
                        {chapters[currentChapterIndex]?.title ||
                            `Chapitre ${currentChapterIndex + 1}`}
                    </h2>
                    <div className="chapter-content">
                        {chapters[currentChapterIndex]?.content.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="btn-next">
                <Button
                    onClick={() => handleSelectChapter(Math.max(0, currentChapterIndex - 1))}
                    disabled={currentChapterIndex === 0}>
                    Précédent
                </Button>
                <Button
                    onClick={handleNextChapter}
                    disabled={false} // On ne désactive plus le bouton pour le dernier chapitre
                >
                    Suivant
                </Button>
            </div>

            {showEndingModal && (
                <div
                    className={`modal-overlay ${showEndingModal ? 'show' : ''}`}
                    onClick={() => setShowEndingModal(false)}>
                    <div className="modal-content">
                        <Ending onClose={() => setShowEndingModal(false)} />
                    </div>
                </div>
            )}
        </section>
    )
}

export default Book
