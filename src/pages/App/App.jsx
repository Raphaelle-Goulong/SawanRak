import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { BooksProvider } from '../../contexts/BooksContext';

import Home from '../Home/Home';
import Book from '../Book/Book';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import LoadingModal from '../../components/LoadingModal/LoadingModal';

import '../App/App.css';



function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Categories');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookFromSearch, setSelectedBookFromSearch] = useState(null);

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleBookSelect = (book) => {
    setSelectedBookFromSearch(book);
    // Réinitialiser après un court délai pour permettre une nouvelle sélection
    setTimeout(() => {
      setSelectedBookFromSearch(null);
    }, 1000);
  };

  // Vérifier si c'est la première visite de la session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('glandia_visited');
    if (hasVisited) {
      setIsLoading(false);
    } else {
      sessionStorage.setItem('glandia_visited', 'true');
    }
  }, []);

  return (
    <BooksProvider> 
      <BrowserRouter>
        {/* Modale de chargement */}
        {isLoading && <LoadingModal onComplete={handleLoadingComplete} />}
        
        {/* Contenu principal */}
        {!isLoading && (
          <>
            <Header 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              onFilterChange={handleFilterChange}
              onBookSelect={handleBookSelect}
            />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    filterType={filterType}
                    onBookSelectFromSearch={selectedBookFromSearch}
                  />
                } 
              />
              <Route 
                path="/home" 
                element={
                  <Home 
                    filterType={filterType}
                    onBookSelectFromSearch={selectedBookFromSearch}
                  />
                } 
              />
              <Route path="/book/:id" element={<Book />} />
            </Routes>
            <Footer />
          </>
        )}
      </BrowserRouter>
    </BooksProvider>
  );
}

export default App;