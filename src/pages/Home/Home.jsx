import '../Home/Home.scss'
import Card from '../../components/Card/Card'
import Carrousel from '../../components/Carrousel/Carrousel'

function Home() {
    return (
        <section className="Section-Home">
            <div className="Home">
                <section id="New-book">
                    <div className="Title-Section">
                        <h2> Récents Ajouts</h2>
                    </div>

                    <div className="New-book-card">
                        <Card /> <Card /> <Card />
                    </div>
                </section>
                <section className="Home-Books-section">
                    <div className='Home-Books'>
                        {/* <div className="Title-Section">
                            <h2> Comédie</h2>
                        </div>
                        <div className="Carrousel-Section">
                            <Carrousel />
                        </div> */}
                         <Carrousel />
                         <Carrousel />
                         <Carrousel />
                    </div>
                </section>
            </div>
        </section>
    )
}

export default Home
