import '../Book/Book.scss'
import Dropdown from '../../components/Dropdown/Dropdown'

function Book() {
    return (
        <section className="Section-Book">
            <div className="Book">
                <div className="title-book">
                    <h2>Titre du livre</h2>
                </div>
                <div className="top-book">
                    <Dropdown />
                    
                </div>
            </div>
        </section>
    )
}

export default Book
