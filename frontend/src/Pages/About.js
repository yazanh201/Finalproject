import React from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';

/**
 * רכיב About
 * רכיב זה מציג את החלק של "אודותינו" בעמוד, כולל כותרת ותיאור קצר על המוסך.
 * הוא מעוצב כך שימשוך את עיני המשתמשים ויעניק להם מידע על הניסיון והשירותים של המוסך.
 * 
 * @returns {JSX.Element} - רכיב ה-About להצגה בדף
 */
function About() {
  return (
    <>
    
    <Header />
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
    
    <Footer />
    </>
  
  );
}

export default About;
