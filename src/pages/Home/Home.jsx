import { useState } from 'react';
import Data from '../../Data.json';
import '../Home/Home.scss';
import Card from '../../components/Card/Card';
import Carrousel from '../../components/Carrousel/Carrousel';
import Resume from '../../components/Resume/Resume';


function Home({ searchTerm }) {
   const sortedBooks = [...Data].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const filteredBooks = searchTerm
    ? Data.filter(book => {
        const searchLower = searchTerm.toLowerCase();
        return (
          book.title.toLowerCase().includes(searchLower) ||
          (book.auteur && book.auteur.toLowerCase().includes(searchLower))
        );
      })
    : sortedBooks;

  const displayBooks = searchTerm ? filteredBooks : sortedBooks.slice(0, 3);
// affichage 3 dernier livres 

    const categories = [
        "Comédie", "Romance", "Entreprise", "Mystique", 
        "School", "Hospital", "Ennemies to Lovers", 
        "Action", "Red Flag", "Adulte"
    ];

    return (
        <>
            <section className="Section-Home">
                <div className="Home">
                    {!searchTerm ? (
                        <>
                            <section id="New-book">
                                <div className="Title-Section">
                                    <h2>Récents Ajouts</h2>
                                </div>
                                <div className="New-book-card">
                                    {displayBooks.map((Book) => (
                                        <Card key={Book.id} Book={Book} />
                                    ))}
                                </div>
                            </section>

                            <section className="Home-Books-section">
                                <div className="Home-Books">
                                    {categories.map(category => (
                                        <Carrousel 
                                            key={category} 
                                            category={category} 
                                            books={Data} 
                                        />
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : (
                        <section className="Search-results">
                            <div className="Title-Section">
                                <h2>Résultats de recherche ({filteredBooks.length})</h2>
                            </div>
                            <div className="Results-grid">
                                {filteredBooks.map((Book) => (
                                    <Card key={Book.id} Book={Book} />
                                ))}
                            </div>
                            {filteredBooks.length === 0 && (
                                <p className="No-results">Aucun résultat trouvé</p>
                            )}
                        </section>
                    )}
                </div>
                {!searchTerm && <Resume />}
            </section>
        </>
    );
}

export default Home;