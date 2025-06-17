import './styles.css';

function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header-bar">
      <div className="logo">Email Leak Checker</div>
      <nav className="nav-links">
        <button
          onClick={() => setCurrentPage('home')}
          className={currentPage === 'home' ? 'nav-btn active' : 'nav-btn'}
        >
          Home
        </button>

        <button
          onClick={() => setCurrentPage('classifier')}
          className={currentPage === 'classifier' ? 'nav-btn active' : 'nav-btn'}
        >
          AI Classifier
        </button>

        <button
          onClick={() => setCurrentPage('ipTracker')}
          className={currentPage === 'ipTracker' ? 'nav-btn active' : 'nav-btn'}
        >
          IP Tracker
        </button>


        <button
          onClick={() => setCurrentPage('features')}
          className={currentPage === 'features' ? 'nav-btn active' : 'nav-btn'}
        >
          Features
        </button>
        <button
          onClick={() => setCurrentPage('Howitworks')}
          className={currentPage === 'Howitworks' ? 'nav-btn active' : 'nav-btn'}
        >
          How It Works
        </button>
        <button
          onClick={() => setCurrentPage('about')}
          className={currentPage === 'about' ? 'nav-btn active' : 'nav-btn'}
        >
          About
        </button>

      </nav>
    </header>
  );
}

export default Header;
