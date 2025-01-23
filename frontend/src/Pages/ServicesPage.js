// ServicesPage.js
import "../Pages/ServicesPage.css";
import Footer from "../components/footer";
import Header from "../components/Header";

function ServicesPage() {
    return (
    <>
      <Header /> 
      <section className="services bg-light py-5" id="body">
        <div className="container text-center">
          {/* כותרת "השירותים שלנו" */}
          <h2 className="mb-4 display-4 text-primary">השירותים שלנו</h2>
  
          {/* שירות ראשון: פחחות וצבע */}
          <div className="service-card mb-4 shadow-lg rounded" id="d1">
            <h4 className="text-uppercase font-weight-bold">פחחות וצבע</h4>
            <p>תיקוני פחחות וצבע לכל סוגי הרכב.</p>
            <p>
              אנו מציעים שירותי פחחות מתקדמים לשחזור מצבו המקורי של הרכב לאחר תאונה
              או פגיעות אחרות. התהליך כולל יישור, צביעה מקצועית והתאמה מלאה לגוון המקורי.
            </p>
          </div>
  
          {/* שירות שני: חשמל ודיאנוסטיקה */}
          <div className="service-card mb-4 shadow-lg rounded" id="d2">
            <h4 className="text-uppercase font-weight-bold">חשמל ודיאנוסטיקה</h4>
            <p>איתור ותיקון תקלות במערכות החשמל והאלקטרוניקה.</p>
            <p>
              המומחים שלנו מאובזרים בכלים מתקדמים לאבחון וטיפול במערכות החשמל של הרכב, כולל תיקון בעיות במערכות האלקטרוניות והממוחשבות.
            </p>
          </div>
  
          {/* שירות שלישי: מיזוג אוויר לרכב */}
          <div className="service-card mb-4 shadow-lg rounded" id="d3">
            <h4 className="text-uppercase font-weight-bold">מיזוג אוויר לרכב</h4>
            <p>תחזוקה, תיקון ומילוי גז למיזוג אוויר ברכב.</p>
            <p>
              אנו מבצעים טיפולים מקצועיים למערכות מיזוג אוויר ברכב, הכוללים תיקון דליפות, החלפת רכיבים פגומים ומילוי גז תקני לשיפור יעילות המיזוג.
            </p>
          </div>

          {/* שירות רביעי: רישוי שנתי */}
          <div className="service-card mb-4 shadow-lg rounded" id="d4">
            <h4 className="text-uppercase font-weight-bold">רישוי שנתי</h4>
            <p>הכנה לטסט וטיפול בכל הדרוש למעבר בטוח.</p>
            <p>
              אנו מטפלים בכל הדרוש כדי להכין את הרכב למעבר הטסט השנתי,
              כולל בדיקות בטיחות, טיפול בתקלות קריטיות והגשת הרכב למבחן הרישוי.
            </p>
          </div>

          {/* שירות חמישי: מכונאות */}
          <div className="service-card mb-4 shadow-lg rounded" id="d5">
            <h4 className="text-uppercase font-weight-bold">מכונאות</h4>
            <p>אבחון, תיקון ותחזוקה לכל סוגי הרכבים.</p>
            <p>
              אנו מספקים שירותי מכונאות מקיפים, החל מתיקוני מנוע ושינוע ועד לתחזוקה שוטפת,
              כדי לשמור על ביצועי הרכב במצב הטוב ביותר.
            </p>
          </div>

          {/* שירות שישי: בדיקות לפני רכישת רכב */}
          <div className="service-card mb-4 shadow-lg rounded" id="d6">
            <h4 className="text-uppercase font-weight-bold">בדיקות לפני רכישת רכב</h4>
            <p>בדיקות מקצועיות לפני קניית רכב.</p>
            <p>
              הבדיקות כוללות סקירה מקיפה של מערכות הרכב, בדיקות שלדתיות, מנוע וחשמל,
              כדי להבטיח קנייה בטוחה ושקולה.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
    );
  }
  
export default ServicesPage;