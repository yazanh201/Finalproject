import React from 'react';
import Hero from './Hero';
import Services from './Services';
import About from './About';
import Contact from './Contact';
import Footer from '../components/footer';
import Header from '../components/Header';

/**
 * רכיב Home - מייצג את דף הבית של האפליקציה.
 * כולל את כל החלקים העיקריים: Header, Hero, Services, About, Contact, Footer.
 */
function Home() {
  return (
  
    <div>
      <Header/>
      <Hero /> {/* חלק ה-Hero */}
      <Services /> {/* חלק השירותים */}
      <section className="about bg-white py-5">
      <div className="container text-center">
        {/* כותרת "אודותינו" */}
        <h2 className="mb-4">אודותינו</h2>

        {/* תיאור קצר על המוסך */}
        <p className="lead">
          במוסך SMC אנו מספקים שירותי תיקונים ותחזוקה איכותיים לרכב כבר מעל 20 שנה,
          הצוות המקצועי שלנו מחויב להבטיח שהרכב שלך יפעל בצורה הטובה ביותר
        </p>
      </div>
    </section>
      <Contact /> {/* חלק יצירת קשר */}
      <Footer /> {/* החלק התחתון של הדף */}
    </div>
  );
}

export default Home;
