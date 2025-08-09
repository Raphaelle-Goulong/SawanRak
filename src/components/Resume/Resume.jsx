import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import mammoth from 'mammoth'
import '../Resume/Resume.scss'
import Card from '../../components/Card/Card'
import Tags from '../Tags/Tags'
import Button from '../Button/Button'
import { X } from 'lucide-react'

function Resume({ book, onClose }) {
    const navigate = useNavigate()
    const [lastChapterInfo, setLastChapterInfo] = useState(null)
    const [isVisible, setIsVisible] = useState(true)
    const [allChapters, setAllChapters] = useState([])
    const [realChapters, setRealChapters] = useState([])
    const [isLoadingChapters, setIsLoadingChapters] = useState(false)

    // Fonction pour extraire les chapitres du fichier Word (même que dans Book.js)
    const convertToJsonStructure = (content) => {
        const lines = content.split('\n');
        const chapters = [];
        let currentChapter = { title: '', content: '' };

        for (const line of lines) {
            const trimmed = line.trim();

            // Détection des titres (même logique que Book.js)
            if (
                trimmed.match(/^(chapitre|chapter)\s+[0-9ivx]+/i) || // "Chapitre 1", "Chapter IV"
                trimmed.match(/^(prologue|épilogue|introduction|conclusion)/i) // Autres sections
            ) {
                // Si on a déjà un chapitre en cours, on l'ajoute
                if (currentChapter.title || currentChapter.content) {
                    chapters.push(currentChapter);
                }
                // On commence un nouveau chapitre
                currentChapter = {
                    title: trimmed,
                    content: ''
                };
            } else {
                // Sinon, on ajoute la ligne au contenu
                currentChapter.content += (currentChapter.content ? '\n\n' : '') + trimmed;
            }
        }

        // On ajoute le dernier chapitre
        if (currentChapter.title || currentChapter.content) {
            chapters.push(currentChapter);
        }

        return chapters;
    };

    // Chargement des vrais chapitres depuis le fichier Word
    useEffect(() => {
        const fetchRealChapters = async () => {
            if (!book.url) return;
            
            setIsLoadingChapters(true);
            try {
                const response = await fetch(book.url);
                const arrayBuffer = await response.arrayBuffer();
                
                const result = await mammoth.extractRawText({ arrayBuffer });
                const extractedChapters = convertToJsonStructure(result.value);
                
                setRealChapters(extractedChapters);
            } catch (error) {
                console.error('Erreur lors du chargement des chapitres:', error);
                // En cas d'erreur, utiliser les chapitres génériques
                setRealChapters([]);
            } finally {
                setIsLoadingChapters(false);
            }
        };

        fetchRealChapters();
    }, [book.url]);

    // 1. Chargement du dernier chapitre (séparé)
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

    // 2. Génération des chapitres - utilise les vrais chapitres si disponibles
    useEffect(() => {
        if (realChapters.length > 0) {
            // Utiliser les vrais chapitres extraits du fichier
            const chaptersList = realChapters.map((chapter, index) => ({
                number: index,
                title: chapter.title || `Chapitre ${index + 1}`
            }));
            setAllChapters(chaptersList);
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
    }, [realChapters, book.chapters, book.description])

    // Handler pour clic sur un chapitre
    const handleChapterClick = (chapterNumber) => {
        navigate(`/book/${book.id}`, {
            state: {
                book,
                chapterIndex: chapterNumber
            }
        })
    }

    // Handler pour le bouton "Lire"
    const handleReadBook = () => {
        navigate(`/book/${book.id}`, { state: { book } })
    }

    // Handler pour fermer le composant
    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    // Si le composant est invisible, on ne rend rien
    if (!isVisible) {
        return null
    }

    return (
        <section className="Section-Resume">
            {/* En-tête avec titre et bouton fermer */}
            <div className="Top-resume">
                <h2>{book.title}</h2>
                <X className="cross" size={20} onClick={handleClose} />
            </div>

            {/* Contenu principal */}
            <div className="Resume">
                {/* Section résumé texte */}
                <div className="text-resume">
                    <h3 id="title-resume">Résumé</h3>
                    <p id="resume-book">{book.description}</p>
                </div>

                {/* Image de couverture + nombre de chapitres */}
                <div className="Resume-img">
                    <Card Book={book} onClick={undefined} />
                    <p>Total chapitres : {book.chapters}</p>
                </div>

                {/* Liste des catégories */}
                <div className="Categorie">
                    {(Array.isArray(book.categorie)
                        ? book.categorie
                        : [book.categorie].filter(Boolean)
                    ).map((category, index) => (
                        <Tags key={index} text={category} />
                    ))}
                </div>

                {/* Section des chapitres */}
                <div className="chapter-available">
                    {/* Dernier chapitre lu */}
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
                                <Tags text={lastChapterInfo.chapterTitle} />
                            </a>
                        ) : (
                            <Tags text={allChapters[0]?.title || 'Chapitre 1'} />
                        )}
                    </div>

                    {/* Liste de tous les chapitres */}
                    <div className="all-chapter">
                        <h4>Tous les chapitres :</h4>
                        {isLoadingChapters ? (
                            <p>Chargement des chapitres...</p>
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