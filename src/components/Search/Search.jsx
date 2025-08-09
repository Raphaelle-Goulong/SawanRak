import '../Search/Search.scss'
import { Search as SearchIcon, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Data from '../../Data.json' // Import de tes données
import Grip from '../Grip/Grip'

function Search({ searchTerm, setSearchTerm, onFilterChange }) {
    const navigate = useNavigate()
    const location = useLocation()

    // Sauvegarder seulement les pages book visitées
    useEffect(() => {
        if (!searchTerm && location.pathname.startsWith('/book/')) {
            localStorage.setItem('lastBookPage', JSON.stringify({
                pathname: location.pathname,
                state: location.state,
                timestamp: Date.now()
            }))
        }
    }, [location, searchTerm])

    const handleClearSearch = () => {
        setSearchTerm('')
        
        // Si on est sur home après une recherche, retourner à la dernière page book
        if (location.pathname === '/' || location.pathname === '/home') {
            // Essayer d'abord la dernière page visitée
            const lastBookPage = localStorage.getItem('lastBookPage')
            
            if (lastBookPage) {
                const parsedPage = JSON.parse(lastBookPage)
                const isRecent = Date.now() - parsedPage.timestamp < 24 * 60 * 60 * 1000 // 24h
                
                if (isRecent) {
                    navigate(parsedPage.pathname, { state: parsedPage.state })
                    return
                }
            }
            
            // Sinon, chercher le dernier livre avec progression
            const findLastReadBook = () => {
                const allKeys = Object.keys(localStorage)
                const progressKeys = allKeys.filter(key => key.match(/^book-\d+-progress$/))
                
                if (progressKeys.length === 0) return null
                
                // Trouver le livre avec la progression la plus récente
                let lastBookId = null
                let lastTimestamp = 0
                
                progressKeys.forEach(key => {
                    const bookId = key.split('-')[1]
                    const linkKey = `book-${bookId}-lastChapterLink`
                    const linkData = localStorage.getItem(linkKey)
                    
                    if (linkData) {
                        try {
                            const parsedLink = JSON.parse(linkData)
                            const timestamp = parsedLink.timestamp || 0
                            if (timestamp > lastTimestamp) {
                                lastTimestamp = timestamp
                                lastBookId = bookId
                            }
                        } catch (e) {
                            // Si pas de timestamp, considérer comme récent
                            lastBookId = bookId
                        }
                    }
                })
                
                return lastBookId
            }
            
            const lastBookId = findLastReadBook()
            if (lastBookId) {
                // Trouver le livre dans les données
                const book = Data.find(b => b.id === lastBookId)
                if (book) {
                    const savedProgress = localStorage.getItem(`book-${lastBookId}-progress`)
                    const chapterIndex = savedProgress ? parseInt(savedProgress, 10) : 0
                    
                    navigate(`/book/${lastBookId}`, {
                        state: {
                            book: book,
                            chapterIndex: chapterIndex
                        }
                    })
                }
            }
        }
    }

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        
        // Rediriger vers home si on tape quelque chose depuis une autre page
        if (newSearchTerm && location.pathname !== '/' && location.pathname !== '/home') {
            navigate('/')
        }
    }

    return (
        <div className="Search">
            <div className="container-input">
                <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="input"
                />
                {!searchTerm ? (
                    <SearchIcon className="search-icon" />
                ) : (
                    <X 
                        className="clear-icon" 
                        onClick={handleClearSearch}
                        style={{ 
                            cursor: 'pointer', 
                            color: '#666'
                        }}
                    />
                )}
            </div>
            <Grip onFilterChange={onFilterChange} />
        </div>
    )
}

export default Search