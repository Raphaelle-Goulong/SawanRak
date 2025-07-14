import '../Navbar/Navbar.scss';
import { Menu } from 'lucide-react';
import Search from '../Search/Search';

function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <section className="Navbar-section">
      <nav className="Navbar">
        <div className="Navbar-title">
          <h1>GLandia</h1>
          <Menu className='menu'/>
        </div>
        <div className="Search-section">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </nav>
    </section>
  );
}

export default Navbar;