import '../Navbar/Navbar.scss'
import { Menu } from 'lucide-react'
import Search from '../Search/Search'

function Navbar() {
    return (
        <section className="Navbar-section">
            <div className="Navbar">
                <div className="Navbar-title">
                    <h1>GLandia</h1>
                    <Menu className='menu'/>
                </div>
                <div className="Search-section">
                    <Search />
                </div>
            </div>
        </section>
    )
}

export default Navbar
