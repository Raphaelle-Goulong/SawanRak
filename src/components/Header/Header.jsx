import '../Header/Header.scss';
import Navbar from '../Navbar/Navbar';

function Header({ searchTerm, setSearchTerm }) {
  return (
    <div className="Header">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );
}

export default Header;
