import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../Home/Home';
import Book from '../Book/Book';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../App/App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BrowserRouter>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/home" element={<Home searchTerm={searchTerm} />} />
        <Route path="/book" element={<Book />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;