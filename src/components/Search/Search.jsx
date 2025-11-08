import '../Search/Search.scss'
import { Search as SearchIcon, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Grip from '../Grip/Grip'

function Search({ searchTerm, setSearchTerm, onFilterChange }) {
    const navigate = useNavigate()
    const location = useLocation()
    const pageBeforeSearchRef = useRef(null)

    // Vérifier si on est sur une page Book
    const isOnBookPage = location.pathname.startsWith('/book/')

    // Sauvegarder seulement les pages book visitées (pour la logique existante)
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
        
        // Si on a une page sauvegardée d'avant la recherche, y retourner
        if (pageBeforeSearchRef.current) {
            console.log('🔙 Returning to saved page:', pageBeforeSearchRef.current)
            const savedPage = pageBeforeSearchRef.current
            pageBeforeSearchRef.current = null // Reset
            
            navigate(savedPage.pathname, { state: savedPage.state })
            return
        }
        
        
        // Logique de fallback (ton code existant)
        if (location.pathname === '/' || location.pathname === '/home') {
            const lastBookPage = localStorage.getItem('lastBookPage')
            
            if (lastBookPage) {
                const parsedPage = JSON.parse(lastBookPage)
                const isRecent = Date.now() - parsedPage.timestamp < 24 * 60 * 60 * 1000
                
                if (isRecent) {
                    navigate(parsedPage.pathname, { state: parsedPage.state })
                    return
                }
            }
            
            // Rest of fallback logic...
        }
    }

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value
        
        
        // Si on vide complètement avec le clavier, utiliser la même logique que handleClearSearch
        if (!newSearchTerm && searchTerm) {
            setSearchTerm('')
            
            // Si on a une page sauvegardée d'avant la recherche, y retourner
            if (pageBeforeSearchRef.current) {
                console.log('🔙 Returning to saved page:', pageBeforeSearchRef.current)
                const savedPage = pageBeforeSearchRef.current
                pageBeforeSearchRef.current = null // Reset
                
                navigate(savedPage.pathname, { state: savedPage.state })
                return
            }
            return
        }
        
        // Sauvegarder la page actuelle quand on commence à taper
        if (newSearchTerm && !searchTerm) {
            pageBeforeSearchRef.current = {
                pathname: location.pathname,
                state: location.state,
                timestamp: Date.now()
            }
            
        }
        
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
            {/* Masquer le Grip sur les pages Book */}
            {!isOnBookPage && <Grip onFilterChange={onFilterChange} />}
        </div>
    )
}

export default Search