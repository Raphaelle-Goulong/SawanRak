import Data from '../../Data.json' // ajoute ça en haut
import '../Home/Home.scss'
import Card from '../../components/Card/Card'
import Carrousel from '../../components/Carrousel/Carrousel'
import Resume from '../../components/Resume/Resume'

function Home() {
    // 1. Trier les livres par date (du plus récent au plus ancien)
    const sortedBooks = [...Data].sort((a, b) => {
        return new Date(b.date) - new Date(a.date) // Tri décroissant
    })

    // 2. Garder seulement les 3 derniers livres
    const lastThreeBooks = sortedBooks.slice(0, 3)

    return (
        <section className="Section-Home">
            <div className="Home">
                <section id="New-book">
                    <div className="Title-Section">
                        <h2> Récents Ajouts</h2>
                    </div>

                    <div className="New-book-card">
                        {lastThreeBooks.map((Book) => (
                            <Card key={Book.id} Book={Book} />
                        ))}
                    </div>
                </section>

                <section className="Home-Books-section">
                    <div className="Home-Books">
                        <Carrousel category="Comédie" books={Data} />
                        <Carrousel category="Romance" books={Data} />
                        <Carrousel category="Entreprise" books={Data} />
                        <Carrousel category="Mystique" books={Data} />
                        <Carrousel category="School" books={Data} />
                        <Carrousel category="Hospital" books={Data} />
                        <Carrousel category="Ennemies to Lovers" books={Data} />
                        <Carrousel category="Action" books={Data} />
                        <Carrousel category="Red Flag" books={Data} />
                        <Carrousel category="Adulte" books={Data} />
                    </div>
                </section>
            </div>
            <Resume />
        </section>
    )
}

export default Home
