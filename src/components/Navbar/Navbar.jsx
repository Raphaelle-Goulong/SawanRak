import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import '../Navbar/Navbar.scss';

import logo from "../../img/ic_launcher.png";
import Search from '../Search/Search';




function Navbar({ searchTerm, setSearchTerm, onFilterChange, onBookSelect }) {
  // Initialise avec la préférence système ou sauvegardée
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    
    // Sinon, utilise la préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const location = useLocation();
  const isOnBookPage = location.pathname.startsWith('/book/');

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    // Sauvegarde la préférence
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Écoute les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Change seulement si l'utilisateur n'a pas changé manuellement
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setIsDarkTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <section className="Navbar-section">
      <nav className="Navbar">
        <div className="Navbar-title">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="logo" />
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