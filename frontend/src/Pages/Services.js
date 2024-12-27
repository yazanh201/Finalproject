import React from 'react';

/**
 * רכיב Services
 * רכיב זה מציג את החלק של "השירותים שלנו" בעמוד, כולל כותרת ושלושה שירותים עיקריים.
 * השירותים מוצגים בתוך כרטיסים מעוצבים, המסודרים ברשת רספונסיבית.
 * 
 * @returns {JSX.Element} - רכיב ה-Services להצגה בדף
 */
function Services() {
  return (
    <section className="services bg-light py-5">
      <div className="container text-center">
        {/* כותרת "השירותים שלנו" */}
        <h2 className="mb-4">השירותים שלנו</h2>

        {/* רשת של שלושה שירותים */}
        <div className="row">
          {/* שירות ראשון: בדיקה כללית */}
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h4>בדיקה כללית של הרכב</h4>
              <p>סקירה מלאה למצב המנוע, מערכות החשמל, הצמיגים ועוד</p>
            </div>
          </div>

          {/* שירות שני: החלפת צמיגים */}
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h4>החלפת צמיגים</h4>
              <p>שירותי החלפת ואיזון צמיגים איכותיים</p>
            </div>
          </div>

          {/* שירות שלישי: בדיקת בלמים */}
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h4>בדיקת בלמים</h4>
              <p>הבטח את בטיחותך עם בדיקות הבלמים המקיפות שלנו</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
