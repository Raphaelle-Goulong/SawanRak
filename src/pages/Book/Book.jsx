import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import mammoth from 'mammoth'
import ChaptersDropdown from '../../components/ChaptersDropdown/ChaptersDropdown'
import Button from '../../components/Button/Button'
import Ending from '../../components/Ending/Ending'
import '../Book/Book.scss'

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

    const convertToJsonStructure = (content) => {
        const paragraphs = content.split('\n')
        const chapters = []
        let currentChapter = { title: '', content: '' }

        paragraphs.forEach((paragraph) => {
            const trimmed = paragraph.trim()

            if (
                trimmed.toLowerCase().startsWith('chapter') ||
                trimmed.toLowerCase().startsWith('chapitre')
            ) {
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

        // Ajouter le dernier chapitre
        if (currentChapter.title || currentChapter.content) {
            chapters.push(currentChapter)
        }

        return chapters
    }

    const handleSelectChapter = (index) => {
        setCurrentChapterIndex(index)
        window.scrollTo(0, 0)
    }

    if (isLoading) return <div className="loading">Chargement...</div>
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
                    onClick={() =>
                        handleSelectChapter(Math.min(chapters.length - 1, currentChapterIndex + 1))
                    }
                    disabled={currentChapterIndex === chapters.length - 1}>
                    Suivant
                </Button>
            </div>

            {/* <Ending /> () */}
        </section>
    )
}

export default Book
