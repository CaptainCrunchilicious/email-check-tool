import { useState } from 'react';
import HomePage from './HomePage';
import FeaturesPage from './FeaturesPage';
import Header from './Header';
import Footer from './Footer';
import HowItWorks from './Howitworks';
import './App.css'
import AboutPage from './AboutPage';
import './styles.css';
import './mobile.css';
import IPTracker from './IPTracker';
import AIEmailClassifierPage from './AIEmailClassifierPage';
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'features':
        return <FeaturesPage onNavigate={setCurrentPage} />;
      case 'howitworks':
        return <HowItWorks />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;

      case 'classifier':
        return <AIEmailClassifierPage />;
      case 'ipTracker':
        return <IPTracker />;
      default:
        return <HowItWorks onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
        <Analytics />
      </main>
      <Footer />
    </div>
  );
}

export default App;
