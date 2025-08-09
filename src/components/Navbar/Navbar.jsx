import { Link } from 'react-router-dom';
import '../Navbar/Navbar.scss';
import { Menu } from 'lucide-react';
import Search from '../Search/Search';


function Navbar({ searchTerm, setSearchTerm, onFilterChange }) {
  return (
    <section className="Navbar-section">
      <nav className="Navbar">
        <div className="Navbar-title">
          <Link to="/" className="navbar-logo">
            <h1>GLandia</h1>
          </Link>
          <Menu className='menu'/>
        </div>
        <div className="Search-section">
          <Search 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onFilterChange={onFilterChange}
          />
        </div>
      </nav>
    </section>
  );
}

export default Navbar;