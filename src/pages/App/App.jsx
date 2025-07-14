import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../Home/Home';
import Book from '../Book/Book';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../App/App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Categories');

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  return (
    <BrowserRouter>
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onFilterChange={handleFilterChange} 
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              searchTerm={searchTerm} 
              filterType={filterType} 
              setFilterType={setFilterType} 
            />
          } 
        />
        <Route path="/home" element={<Home searchTerm={searchTerm} filterType={filterType} />} />
        <Route path="/book" element={<Book />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;