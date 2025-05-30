import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
import './cssfiles/Header.css';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header1">
      <div className="logo">
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
      {/* ב div הזה מיצרים את התפריט hamburger ו כשלוחצים על התפריט (שלושה קווים) גולל תפריט למטה (togglemenu)*/}
      <ul className={`menu ${isOpen ? 'open' : ''}`}>
      <li><Link to="/login">אזור אישי </Link></li>
        <li><Link to="/about">אודות</Link></li>
        <li><Link to="/ServicesPage">שירותים</Link></li>
        <li><Link to="/contact">צור קשר</Link></li>
        <li><Link to="/">עמוד הבית</Link></li>
        
      
      </ul>
    </div>
    // הפונקציה toggleMenu משמשת לשנות את מצב isOpen (מצב פתיחת התפריט). היא מופעלת כאשר יש אינטראקציה עם האלמנט 
    // אם isOpen שווה ל-false (ברירת המחדל), הפונקציה הופכת אותו ל-true, וכך התפריט נפתח.
// אם  isOpen שווה ל-true, הפונקציה הופכת אותו ל-false, וכך התפריט נסגר.   
  );
}

export default Header;
