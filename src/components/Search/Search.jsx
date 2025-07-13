import '../Search/Search.scss'
// import { Grip } from 'lucide-react'
import Dropdown from '../Dropdown/Dropdown'
import Grip from '../Grip/Grip'

import { Search as SearchIcon } from 'lucide-react'

function Search() {
    return (
        <>
            <div className="Search">
                <form action="">
                    <input type="text" name="Rechercher" id="Rechercher" placeholder="Rechercher" />
                    <SearchIcon className="recherche" />
                </form>
                <Grip />
                
            </div>
        </>
    )
}

export default Search
