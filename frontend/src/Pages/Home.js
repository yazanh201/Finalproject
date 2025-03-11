import React from 'react';
import Hero from './Hero';
import Footer from '../components/footer';
import Header from '../components/Header';

/**
 * רכיב Home - מייצג את דף הבית של האפליקציה.
 * כולל את כל החלקים העיקריים: Header, Hero, Services, About, Contact, Footer.
 */
function Home() {
  return (
    <div>
      <Header />
      <Hero /> {/* חלק ה-Hero */}

      {/* אזור השירותים */}
      <section className="services bg-dark py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="text-white me-3">השירותים שלנו</h2>
          </div>
          <div className="row">
            {/* שירות 1 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow service-card">
                <img src="/img/p3.jpeg" alt="MOT Testing" className="card-img-top" />
                <div className="card-body text-center">
                  <h5 className="card-title">שירות כללי</h5>
                  <p className="card-text">אנו מציעים שירות כללי לרכב הכולל החלפת שמן, פילטר שמן ופילטר אוויר, עם דגש על שמירה על ביצועי הרכב ובטיחותו</p>
                  <button className="btn btn-primary">פרטים נוספים</button>
                </div>
              </div>
            </div>

            {/* שירות 2 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow service-card">
                <img src="/img/p2.jpeg" className="card-img-top" alt="Remapping" />
                <div className="card-body text-center">
                  <h5 className="card-title">בדיקה כללית</h5>
                  <p className="card-text">בדיקה ממוחשבת לאיתור תקלות במנוע, חשמל ומערכות הרכב, להבטחת תקינות ובטיחות הרכב</p>
                  <button className="btn btn-primary">פרטים נוספים</button>
                </div>
              </div>
            </div>

            {/* שירות 3 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow service-card">
                <img src="/img/p4.jpeg" className="card-img-top" alt="Tyres" />
                <div className="card-body text-center">
                  <h5 className="card-title">צמיגים</h5>
                  <p className="card-text">התקנה, תיקון והחלפה של צמיגים לכל סוגי הרכבים, תוך דגש על איכות, בטיחות ועמידות לאורך זמן</p>
                  <button className="btn btn-primary">פרטים נוספים</button>
                </div>
              </div>
            </div>

            {/* שירות 4 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow service-card">
                <img src="/img/p5.jpg" alt="Diagnostics" className="card-img-top" />
                <div className="card-body text-center">
                  <h5 className="card-title">מיזוג אוויר</h5>
                  <p className="card-text">תחזוקה ותיקון מערכות מיזוג אוויר ברכב, כולל מילוי גז ותיקון דליפות לשמירה על יעילות המיזוג</p>
                  <button className="btn btn-primary">פרטים נוספים</button>
                </div>
              </div>
            </div>

            {/* שירות 5 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow service-card">
                <img src="/img/p6.jpeg" alt="Air Conditioning" className="card-img-top" />
                <div className="card-body text-center">
                  <h5 className="card-title">בדיקה לפני טסט</h5>
                  <p className="card-text">בדיקה מקיפה לרכב הכוללת בדיקת בלמים, תאורה, צמיגים ומערכות בטיחות, להכנת הרכב למעבר בטוח ומהיר בטסט השנתי</p>
                  <button className="btn btn-primary">פרטים נוספים</button>
                </div>
              </div>
            </div>

            {/* שירות 6 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow service-card">
                <img src="/img/p7.webp" alt="Battery Services" className="card-img-top" />
                <div className="card-body text-center">
                  <h5 className="card-title">תיקונים</h5>
                  <p className="card-text">טיפול ותיקון מערכות הרכב, כולל מנוע, בלמים, מתלים ותיבות הילוכים, על ידי צוות מומחים לשמירה על ביצועי הרכב ואמינותו</p>
                  <button className="btn btn-primary">פרטים נוספים</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* אזור "אודותינו" */}
      <section className="about bg-white py-5">
        <div className="container text-center">
          {/* כותרת "אודותינו" */}
          <h2 className="mb-4 me-2">אודותינו</h2>

          {/* תיאור קצר על המוסך */}
          <p className="lead">
            במוסך SMC אנו מספקים שירותי תיקונים ותחזוקה איכותיים לרכב כבר מעל 20 שנה,
            הצוות המקצועי שלנו מחויב להבטיח שהרכב שלך יפעל בצורה הטובה ביותר.
          </p>
        </div>
      </section>

      {/* טופס יצירת קשר */}
      <section className="contact-form-section bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow p-4">
                <h3 className="text-center mb-4">צור קשר</h3>
                <form>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="name" className="form-label">שם מלא</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="הכנס את שמך"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="email" className="form-label">אימייל</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="הכנס את כתובת האימייל שלך"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="message" className="form-label">הודעה</label>
                      <input
                        type="text"
                        className="form-control"
                        id="message"
                        placeholder="כתוב את הודעתך כאן"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary">שלח הודעה</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer /> {/* החלק התחתון של הדף */}
    </div>
  );
}

export default Home;
