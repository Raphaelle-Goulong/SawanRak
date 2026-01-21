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

        // Ouvrir la modale si il y a du texte, la fermer sinon
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
                        <h1>GLandia</h1>
                        <p>Hello Raph, es-tu prête pour de nouvelles aventures ?</p>
                    </div>
                    <div className="input-search">
                        <input
                            type="text"
                            placeholder="Recherche par titre, auteur..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="input"
                        />
                        <SearchIcon className="search-icon" />
                    </div>
                </div>
            </div>

            {/* Modale de résultats de recherche */}
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
