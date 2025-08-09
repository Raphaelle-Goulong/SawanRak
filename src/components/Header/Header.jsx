import '../Header/Header.scss';
import Navbar from '../Navbar/Navbar';


function Header({ searchTerm, setSearchTerm, onFilterChange }) {
  return (
    <div className="Header">
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onFilterChange={onFilterChange} 
      />
    </div>
  );
}

export default Header;