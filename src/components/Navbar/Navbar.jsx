import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../Navbar/Navbar.scss';
import { Menu } from 'lucide-react';
import Search from '../Search/Search';

function Navbar({ searchTerm, setSearchTerm, onFilterChange }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <section className="Navbar-section">
      <nav className="Navbar">
        <div className="Navbar-title">
          <Link to="/" className="navbar-logo">
            <h1>GLandia</h1>
          </Link>
          
          <label className="switch-container">
            <input 
              type="checkbox" 
              checked={isDarkTheme} 
              onChange={handleThemeChange}
            />
            <span className="slider"></span>
          </label>
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