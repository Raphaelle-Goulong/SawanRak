import { useState, useEffect } from 'react';
import '../Card/Card.scss';

function Card({ Book, onClick = () => {} }) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (Book?.id) {
            const saved = localStorage.getItem(`book-${Book.id}-liked`);
            setIsLiked(saved === 'true');
        }
    }, [Book?.id]);

    // Écoute l'événement émis par Heart.jsx
    // Met à jour le coeur instantanément sans fermer la modale
    useEffect(() => {
        const handleHeartChanged = (e) => {
            if (e.detail.bookId === Book?.id) {
                setIsLiked(e.detail.liked);
            }
        };

        window.addEventListener('heart-changed', handleHeartChanged);

        // Nettoyage de l'écouteur au démontage du composant
        return () => window.removeEventListener('heart-changed', handleHeartChanged);
    }, [Book?.id]);

    if (!Book || !Book.cover || !Book.title) {
        return null;
    }

    return (
        <div className="Card" onClick={(e) => {
            e.stopPropagation();
            onClick(Book);
        }}>
            <div className="Img-books">
                <img src={Book.cover} alt={`Couverture de ${Book.title}`} />
                {isLiked && (
                    <div className="heart-indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                        </svg>
                    </div>
                )}
            </div>
            <div className="Title-books">
                <h3>{Book.title}</h3>
            </div>
        </div>
    );
}

export default Card;