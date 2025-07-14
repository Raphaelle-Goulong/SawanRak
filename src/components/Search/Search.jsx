import '../Search/Search.scss';
import { Search as SearchIcon } from 'lucide-react';
import  Grip  from '../Grip/Grip';

function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="Search">
      <div className="container-input ">
        <input
          type="text"
          placeholder="Rechercher"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           className="input"
        />
        <SearchIcon className="search-icon" />
      </div>
      <Grip />
    </div>
  );
}

export default Search;