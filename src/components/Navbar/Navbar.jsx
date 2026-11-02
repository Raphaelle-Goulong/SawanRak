import { Link, useLocation } from 'react-router-dom';

import '../Navbar/Navbar.scss';

import NeonLogo from '../NeonLogo/NeonLogo';
import Search from '../Search/Search';

function Navbar({ searchTerm, setSearchTerm, onFilterChange, onBookSelect }) {
  const location = useLocation();
  const isOnBookPage = location.pathname.startsWith('/book/');

  return (
    <section className="Navbar-section">
      <nav className="Navbar">
        <div className="Navbar-title">
          <Link to="/" className="navbar-logo" aria-label="Glandia, retour à l'accueil">
            {isOnBookPage && <NeonLogo size="sm" />}
          </Link>
        </div>

        {!isOnBookPage && (
          <div className="Search-section">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onFilterChange={onFilterChange}
              onBookSelect={onBookSelect}
            />
          </div>
        )}
      </nav>
    </section>
  );
}

export default Navbar;