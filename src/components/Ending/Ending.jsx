import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Data from '../../Data.json'; // Importez vos données de livres
import '../Ending/Ending.scss';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { X, Frown } from 'lucide-react';


function Ending({ onClose }) {

    const location = useLocation();
    const currentBook = location.state?.book; // Récupérez le livre actuel
    const [similarBooks, setSimilarBooks] = useState([]);

 useEffect(() => {
        if (currentBook && currentBook.categorie) {
            // Trouvez des livres de la même catégorie
            const sameCategoryBooks = Data.filter(book => {
                // Gère à la fois les catégories sous forme de string ou d'array
                const bookCategories = Array.isArray(book.categorie) 
                    ? book.categorie 
                    : [book.categorie];
                const currentCategories = Array.isArray(currentBook.categorie) 
                    ? currentBook.categorie 
                    : [currentBook.categorie];
                
                return book.id !== currentBook.id && 
                       bookCategories.some(cat => currentCategories.includes(cat));
            });

            // Mélangez et sélectionnez 3 livres maximum
            const shuffled = [...sameCategoryBooks].sort(() => 0.5 - Math.random());
            setSimilarBooks(shuffled.slice(0, 3));
        }
    }, [currentBook]);


    return (
        <section className="Section-Ending">
            <X className="cross" size={20} />
            <h2>Tu es arrivée à la fin du livre</h2>
            <Frown />
            <Frown />
            <Frown />
            <div className="Note">
                <div className="title">
                    <h3>N'oublie pas de noter</h3>
                </div>
                <div className="star">
                    <div className="radio">
                        <input id="rating-5" type="radio" name="rating" value="5" />
                        <label htmlFor="rating-5" title="5 stars">
                            <svg
                                viewBox="0 0 576 512"
                                height="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                            </svg>
                        </label>

                        <input id="rating-4" type="radio" name="rating" value="4" />
                        <label htmlFor="rating-4" title="4 stars">
                            <svg
                                viewBox="0 0 576 512"
                                height="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                            </svg>
                        </label>

                        <input id="rating-3" type="radio" name="rating" value="3" />
                        <label htmlFor="rating-3" title="3 stars">
                            <svg
                                viewBox="0 0 576 512"
                                height="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                            </svg>
                        </label>

                        <input id="rating-2" type="radio" name="rating" value="2" />
                        <label htmlFor="rating-2" title="2 stars">
                            <svg
                                viewBox="0 0 576 512"
                                height="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                            </svg>
                        </label>

                        <input id="rating-1" type="radio" name="rating" value="1" />
                        <label htmlFor="rating-1" title="1 star">
                            <svg
                                viewBox="0 0 576 512"
                                height="1em"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
            <div className="other-books">
                <div className="title">
                    <h3>Livre qui pourrait te plaire</h3>
                </div>
                <div className="book-cat">
                    {similarBooks.length > 0 ? (
                        similarBooks.map(book => (
                            <Card 
                                key={book.id} 
                                Book={book} 
                                onClick={() => window.location.reload()} // Ou une meilleure gestion de navigation
                            />
                        ))
                    ) : (
                        <p>Aucune suggestion disponible</p>
                    )}
                </div>
            </div>
            <div className="btn-quit">
                <Link to="/" className="home-link">
                    <Button onClick={onClose} text="Retour Page Home" />
                </Link>
            </div>
        </section>
    )
}

export default Ending
