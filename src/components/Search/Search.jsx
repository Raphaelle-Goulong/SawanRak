import '../Search/Search.scss'
import { Search as SearchIcon, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import ResultSearch from '../ResultSearch/ResultSearch'

function Search({ searchTerm, setSearchTerm, onBookSelect }) {
    const location = useLocation()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        setIsModalOpen(newSearchTerm.length > 0)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSearchTerm('')
    }

    return (
        <>
            <div className="Search">
                <div className="container-input">
                    <div className="text-section">
                        {/* On enveloppe le titre pour pouvoir ajouter un halo derrière */}
                        <div className="title-wrapper">
                            <h1>GLandia</h1>
                        </div>
                        <p>Hello Raph, es-tu prête pour de nouvelles aventures ?</p>
                    </div>
                    
                    <div className="input-search">
                        <div className="input-wrapper">
                            <SearchIcon className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Recherche par titre, auteur..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="input"
                            />
                            {searchTerm && (
                                <button className="clear-btn" onClick={handleCloseModal} aria-label="Effacer">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ResultSearch
                searchTerm={searchTerm}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onBookSelect={onBookSelect}
            />
        </>
    )
}

export default Search