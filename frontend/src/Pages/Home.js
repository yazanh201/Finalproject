import React from 'react';
import Layout from '../components/layout';
import Hero from './Hero';
import Services from './Services';
import About from './About';
import Contact from './Contact';
import Footer from '../components/footer';

/**
 * רכיב Home - מייצג את דף הבית של האפליקציה.
 * כולל את כל החלקים העיקריים: Header, Hero, Services, About, Contact, Footer.
 */
function Home() {
  return (
  
    <div>
    
      <Hero /> {/* חלק ה-Hero */}
      <Services /> {/* חלק השירותים */}
      <About /> {/* חלק האודות */}
      <Contact /> {/* חלק יצירת קשר */}
      <Footer /> {/* החלק התחתון של הדף */}
    </div>
  );
}

export default Home;
