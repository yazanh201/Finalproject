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

        {/* רשת של ארבעה שירותים */}
        <div className="row">
          {/*שירות ראשון :פחחות וצבע  */}
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h4>  פחחות וצבע</h4>
              <p>תיקוני פחחות וצבע לכל סוגי הרכב</p>
            </div>
          </div>

          {/* שירות שני: חשמל ודיאנוסטיקה*/}
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h4>חשמל ודיאנוסטיקה</h4>
              <p>  איתור ותיקון תקלות במערכות החשמל והאלקטרוניקה</p>            
            </div>
          </div>

          {/* שירות שלישי: מיזוג אוויר לרכב*/}
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h4>מיזוג אוויר לרכב</h4>
              <p>תחזוקה, תיקון ומילוי גז למיזוג אוויר ברכב  </p>
            </div>
          </div>
          {/* שירות רביעי:רישוי שנתי*/}
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-l">
              <h4>רישוי שנתי</h4>
              <p>  הכנה לטסט וטיפול בכל הדרוש למעבר בטוח</p>
            </div>
          </div>
          {/*שירות חמישי:מכונאות*/}
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h4>מכונאות</h4>
              <p>אבחון, תיקון ותחזוקה לכל סוגי הרכבים</p>
            </div>
          </div>
          {/*שירות חמישי:בדיקות*/}
          <div className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h4>בדיקות לפני רכישת רכב</h4>
              <p>בדיקות מקצועיות לפני קניית רכב </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
