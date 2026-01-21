import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Data from '../../Data.json';
import '../Home/Home.scss';

import Card from '../../components/Card/Card';
import Categories from '../../components/Sort/Categories/Categories';
import Resume from '../../components/Resume/Resume';
import TagsNavigation from "../../components/TagsNavigation/TagsNavigation";

function Home({ filterType, onBookSelectFromSearch }) {
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [lastViewedBooks, setLastViewedBooks] = useState([]);
    const [activeTag, setActiveTag] = useState('last-viewed');
    const location = useLocation();

    // Fonction pour récupérer les derniers livres consultés
    const getLastViewedBooks = () => {
        try {
            const stored = localStorage.getItem('lastViewedBooks');
            if (stored) {
                const bookIds = JSON.parse(stored);
                const books = bookIds
                    .map((id) => Data.find((book) => book.id === id))
                    .filter((book) => book !== undefined)
                    .slice(0, 10);
                return books;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des livres consultés:', error);
        }
        return [];
    };

    // Fonction pour ajouter un livre aux derniers consultés
    const addToLastViewed = (bookId) => {
        try {
            const stored = localStorage.getItem('lastViewedBooks');
            let viewedBooks = stored ? JSON.parse(stored) : [];
            viewedBooks = viewedBooks.filter((id) => id !== bookId);
            viewedBooks.unshift(bookId);
            viewedBooks = viewedBooks.slice(0, 10);
            localStorage.setItem('lastViewedBooks', JSON.stringify(viewedBooks));
            setLastViewedBooks(getLastViewedBooks());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du livre consulté:', error);
        }
    };

    // Récupérer les 3 derniers livres ajoutés
    const getRecentBooks = () => {
        return [...Data]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
    };

    // Fonction pour obtenir 20 livres aléatoires qui changent chaque jour
    const getDailyRandomBooks = () => {
        // Utiliser la date du jour comme seed pour avoir les mêmes livres toute la journée
        const today = new Date().toDateString();
        
        // Créer un générateur pseudo-aléatoire basé sur la date
        const seedRandom = (seed) => {
            let value = 0;
            for (let i = 0; i < seed.length; i++) {
                value = ((value << 5) - value) + seed.charCodeAt(i);
                value = value & value;
            }
            return () => {
                value = (value * 9301 + 49297) % 233280;
                return value / 233280;
            };
        };

        const random = seedRandom(today);
        
        // Mélanger les livres avec le seed du jour
        const shuffled = [...Data].sort(() => random() - 0.5);
        
        // Retourner 20 livres (ou moins si pas assez de livres)
        return shuffled.slice(0, Math.min(20, Data.length));
    };

    const handleCardClick = (book) => {
        setSelectedBook(book);
        setShowModal(true);
        addToLastViewed(book.id);

        setTimeout(() => {
            const modal = document.querySelector('.Section-Resume');
            if (modal) {
                modal.classList.add('visible');
            }
        }, 50);
    };

    const handleCloseResume = () => {
        setIsClosing(true);
        const modal = document.querySelector('.Section-Resume');
        const overlay = document.querySelector('.resume-modal-overlay');

        if (modal) {
            modal.classList.remove('visible');
            modal.classList.add('closing');
        }

        if (overlay) {
            overlay.classList.remove('show');
        }

        setTimeout(() => {
            setSelectedBook(null);
            setShowModal(false);
            setIsClosing(false);
        }, 300);
    };

    const handleTagClick = (tagId) => {
        setActiveTag(tagId);
    };

    // Déterminer le contenu à afficher selon le tag actif
    const renderContent = () => {
        if (activeTag === 'last-viewed') {
            return (
                <section id="Last-book">
                    <div className="Last-Title-Section">
                        <h2>Dernier Livre Consulté</h2>
                    </div>
                    <div className="Last-New-book-card">
                        {lastViewedBooks.length > 0 ? (
                            lastViewedBooks.slice(0, 1).map((book) => (
                                <Card
                                    key={`last-viewed-${book.id}`}
                                    Book={book}
                                    onClick={() => handleCardClick(book)}
                                />
                            ))
                        ) : (
                            <p className="no-books-message">Aucun livre consulté récemment</p>
                        )}
                    </div>
                    
                    {/* Section Découvertes du Jour */}
                    <section id="Daily-discoveries">
                        <div className="Title-Section">
                            <h2>✨ Découvertes du Jour</h2>
                            <p className="subtitle">20 livres sélectionnés pour vous aujourd'hui</p>
                        </div>
                        <div className="Daily-books-grid">
                            {getDailyRandomBooks().map((book) => (
                                <Card
                                    key={`daily-${book.id}`}
                                    Book={book}
                                    onClick={() => handleCardClick(book)}
                                />
                            ))}
                        </div>
                    </section>
                </section>
            );
        }

        if (activeTag === 'recent') {
            const recentBooks = getRecentBooks();
            return (
                <>
                    <section id="New-book">
                        <div className="Title-Section">
                            <h2>Récents Ajouts</h2>
                        </div>
                        <div className="New-book-card">
                            {recentBooks.map((book) => (
                                <Card
                                    key={book.id}
                                    Book={book}
                                    onClick={() => handleCardClick(book)}
                                />
                            ))}
                        </div>
                    </section>
                    
                    {/* Section Découvertes du Jour */}
                    <section id="Daily-discoveries">
                        <div className="Title-Section">
                            <h2>✨ Découvertes du Jour</h2>
                            <p className="subtitle">20 livres sélectionnés pour vous aujourd'hui</p>
                        </div>
                        <div className="Daily-books-grid">
                            {getDailyRandomBooks().map((book) => (
                                <Card
                                    key={`daily-${book.id}`}
                                    Book={book}
                                    onClick={() => handleCardClick(book)}
                                />
                            ))}
                        </div>
                    </section>
                </>
            );
        }

        if (activeTag === 'categories') {
            return (
                <section className="Home-Books-section">
                    <div className="Home-Books">
                        <Categories filterType="Categories" onCardClick={handleCardClick} />
                    </div>
                </section>
            );
        }

        if (activeTag === 'authors') {
            return (
                <section className="Home-Books-section">
                    <div className="Home-Books">
                        <Categories filterType="Author" onCardClick={handleCardClick} />
                    </div>
                </section>
            );
        }

        if (activeTag === 'all') {
            return (
                <section className="Home-Books-section">
                    <div className="Home-Books">
                        <Categories filterType="All" onCardClick={handleCardClick} />
                    </div>
                </section>
            );
        }
    };

    // Charger les derniers livres consultés au démarrage
    useEffect(() => {
        const books = getLastViewedBooks();
        setLastViewedBooks(books);
    }, []);

    // Gérer l'ouverture de la modale Resume depuis la recherche
    useEffect(() => {
        if (onBookSelectFromSearch) {
            const timer = setTimeout(() => {
                handleCardClick(onBookSelectFromSearch);
            }, 400);
            
            return () => clearTimeout(timer);
        }
    }, [onBookSelectFromSearch]);

    useEffect(() => {
        if (location.state?.fromEnding && location.state?.book) {
            setSelectedBook(location.state.book);
            setShowModal(true);
            addToLastViewed(location.state.book.id);

            setTimeout(() => {
                const modal = document.querySelector('.Section-Resume');
                if (modal) {
                    modal.classList.add('visible');
                }
            }, 100);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        if (showModal) {
            setTimeout(() => {
                const overlay = document.querySelector('.resume-modal-overlay');
                if (overlay) {
                    overlay.classList.add('show');
                }
            }, 10);
        }
    }, [showModal]);

    return (
        <section className="Section-Home">
            <div className="Home">
                {/* Navigation par tags */}
                <div className='Tags-Navigation-Container'>
                    <TagsNavigation 
                        activeTag={activeTag}
                        onTagClick={handleTagClick}
                    />
                </div>

                {/* Contenu dynamique selon le tag sélectionné */}
                <div className="dynamic-content">
                    {renderContent()}
                </div>
            </div>

            {/* Modal Resume */}
            {showModal && selectedBook && (
                <div className="resume-modal-overlay" onClick={handleCloseResume}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <Resume book={selectedBook} onClose={handleCloseResume} />
                    </div>
                </div>
            )}
        </section>
    );
}

export default Home;