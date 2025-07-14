import '../Navbar/Navbar.scss';
import { Menu } from 'lucide-react';
import Search from '../Search/Search';

function Navbar({ searchTerm, setSearchTerm , onFilterChange}) {
  return (
    <section className="Navbar-section">
      <nav className="Navbar">
        <div className="Navbar-title">
          <h1>GLandia</h1>
          <Menu className='menu'/>
        </div>
        <div className="Search-section">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFilterChange={onFilterChange}/>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;