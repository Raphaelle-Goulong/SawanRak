// BooksContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import mammoth from 'mammoth';

const BooksContext = createContext();

export const useBooksContext = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooksContext must be used within a BooksProvider');
  }
  return context;
};

// Fonction utilitaire pour convertir le contenu
const convertToJsonStructure = (content) => {
  const lines = content.split('\n');
  const chapters = [];
  let currentChapter = { title: '', content: '' };

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.match(/^(chapitre|chapter)\s+[0-9ivx]+/i) ||
      trimmed.match(/^(prologue|épilogue|introduction|conclusion)/i)
    ) {
      if (currentChapter.title || currentChapter.content) {
        chapters.push(currentChapter);
      }
      currentChapter = { title: trimmed, content: '' };
    } else {
      currentChapter.content += (currentChapter.content ? '\n\n' : '') + trimmed;
    }
  }

  if (currentChapter.title || currentChapter.content) {
    chapters.push(currentChapter);
  }

  return chapters;
};

export const BooksProvider = ({ children }) => {
  const [booksChapters, setBooksChapters] = useState({}); // Cache des chapitres par book.id
  const [loadingBooks, setLoadingBooks] = useState({}); // État de chargement par book.id

  const loadBookChapters = useCallback(async (book) => {
    // Si déjà en cache, retourner directement
    if (booksChapters[book.id]) {
      return booksChapters[book.id];
    }

    // Si déjà en cours de chargement, attendre
    if (loadingBooks[book.id]) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (booksChapters[book.id]) {
            resolve(booksChapters[book.id]);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    if (!book.url) return [];

    // Marquer comme en cours de chargement
    setLoadingBooks(prev => ({ ...prev, [book.id]: true }));

    try {
      const response = await fetch(book.url);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const extractedChapters = convertToJsonStructure(result.value);

      // Sauvegarder en cache
      setBooksChapters(prev => ({
        ...prev,
        [book.id]: extractedChapters
      }));

      // Marquer comme terminé
      setLoadingBooks(prev => ({ ...prev, [book.id]: false }));

      return extractedChapters;
    } catch (error) {
      console.error('Erreur lors du chargement des chapitres:', error);
      setLoadingBooks(prev => ({ ...prev, [book.id]: false }));
      return [];
    }
  }, [booksChapters, loadingBooks]);

  const getBookChapters = (bookId) => booksChapters[bookId] || null;
  const isLoadingBook = (bookId) => loadingBooks[bookId] || false;

  const value = {
    loadBookChapters,
    getBookChapters,
    isLoadingBook,
    booksChapters
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};