import '../Search/Search.scss'
import { Search as SearchIcon, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Data from '../../Data.json' // Import de tes données
import Grip from '../Grip/Grip'

function Search({ searchTerm, setSearchTerm, onFilterChange }) {
    const navigate = useNavigate()
    const location = useLocation()
    const pageBeforeSearchRef = useRef(null)

    // Debug - afficher l'état actuel
    console.log('🔍 Search render:', {
        searchTerm,
        currentPath: location.pathname,
        savedPage: pageBeforeSearchRef.current
    })

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
        console.log('🧹 Clear search clicked', {
            currentPath: location.pathname,
            savedPage: pageBeforeSearchRef.current
        })
        
        setSearchTerm('')
        
        // Si on a une page sauvegardée d'avant la recherche, y retourner
        if (pageBeforeSearchRef.current) {
            console.log('🔙 Returning to saved page:', pageBeforeSearchRef.current)
            const savedPage = pageBeforeSearchRef.current
            pageBeforeSearchRef.current = null // Reset
            
            navigate(savedPage.pathname, { state: savedPage.state })
            return
        }
        
        console.log('❌ No saved page, using fallback logic')
        
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
        
        console.log('✏️ Search change:', {
            from: searchTerm,
            to: newSearchTerm,
            currentPath: location.pathname,
            willSave: newSearchTerm && !searchTerm
        })
        
        // Si on vide complètement avec le clavier, utiliser la même logique que handleClearSearch
        if (!newSearchTerm && searchTerm) {
            console.log('⌫ Cleared with keyboard, using clear logic')
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
            console.log('💾 Saved current page:', pageBeforeSearchRef.current)
        }
        
        setSearchTerm(newSearchTerm)
        
        // Rediriger vers home si on tape quelque chose depuis une autre page
        if (newSearchTerm && location.pathname !== '/' && location.pathname !== '/home') {
            console.log('🏠 Redirecting to home from:', location.pathname)
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