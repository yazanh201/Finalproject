
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-red-600/20">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-300 border-b border-gray-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500" />
              <span>972+ 0499301</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>גמלים ונט 9, חיפה</span>
            </div>
          </div>
          <div className="text-gray-400">
            ראשון - חמישי: 8:30 - 17:30 | שישי: 8:30 - 13:00
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-white hover:text-red-400 transition-colors">
            <span className="text-red-500">מוסך</span> שירות מהיר
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white hover:text-red-500 transition-colors duration-200"
            >
              עמוד הבית
            </Link>
            <Link
              to="/services"
              className="text-white hover:text-red-500 transition-colors duration-200"
            >
              שירותים
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-red-500 transition-colors duration-200"
            >
              אודות
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-red-500 transition-colors duration-200"
            >
              צור קשר
            </button>

          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-white hover:text-red-500 transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                עמוד הבית
              </Link>
              <Link
                to="/services"
                className="text-white hover:text-red-500 transition-colors text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                שירותים
              </Link>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-red-500 transition-colors text-right"
              >
                אודות
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-red-500 transition-colors text-right"
              >
                צור קשר
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all duration-200 mt-4"
              >
                קבע תור
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
