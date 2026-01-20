import Navbar from '../Navbar/Navbar';

import '../Header/Header.scss';



function Header({ searchTerm, setSearchTerm, onFilterChange, onBookSelect }) {
  return (
    <header className="Header">
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onFilterChange={onFilterChange}
        onBookSelect={onBookSelect}
      />
    </header>
  );
}

export default Header;