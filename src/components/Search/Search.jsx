import '../Search/Search.scss'
import { Search as SearchIcon, X } from 'lucide-react'
import Grip from '../Grip/Grip'

function Search({ searchTerm, setSearchTerm, onFilterChange }) {
    const handleClearSearch = () => {
        setSearchTerm('')
    }

    return (
        <div className="Search">
            <div className="container-input">
                <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input"
                />
                {!searchTerm ? (
                    <SearchIcon className="search-icon" />
                ) : (
                    <X 
                        className="clear-icon" 
                        onClick={handleClearSearch}

                    />
                )}
            </div>
            <Grip onFilterChange={onFilterChange} />
        </div>
    )
}

export default Search