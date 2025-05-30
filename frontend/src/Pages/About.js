import React from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';
import './ServicesPage.css';
import ChatBot from '../components/ChatBot';

function About() {
  return (
    <>
      <Header />

      {/* תמונת ראש עמוד עם אפקט כהה וכיתוב מרשים */}
      <div className="hero-about position-relative">
        <img 
          src="/img/ABOUT2.png" 
          alt="תמונה של המוסך" 
          className="img-fluid w-100 hero-image"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">ברוכים הבאים למוסך שירות מהיר</h1>
          <p className="hero-subtitle">אנו מחויבים לאיכות, אמינות ושירות ברמה הגבוהה ביותר</p>
        </div>
      </div>

      <section className="about bg-white py-5">
        <div className="container text-center">
          {/* כותרת מעוצבת */}
          <h2 className="mb-4 about-title">אודותינו</h2>

          {/* תיאור קצר בעיצוב יפה יותר */}
          <p className="about-description">
            מוסך <span className="highlight-text">שירות מהיר</span> הוא הרבה יותר מסתם מוסך – זהו <strong>בית לרכב שלך.</strong><br/>
            עם ניסיון של מעל <span className="highlight-text">20 שנה</span>, אנו מחויבים להעניק לכל לקוח שירות אמין, מקצועי ואיכותי, תוך שימוש בטכנולוגיות מתקדמות ושיטות עבודה חדשניות.
          </p>  

          {/* הצוות שלנו - כרטיס מעוצב */}
          <div className="row justify-content-center mt-5">
            <div className="col-md-10">
              <div className="service-card">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center">
                    <img 
                      src="/img/ABOUT3.png" 
                      alt="הצוות שלנו" 
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-8 text-end">
                    <h4 className="card-title">הצוות שלנו</h4>
                    <p className="card-text">
                      אנחנו גאים בצוות <span className="highlight-text">המקצועי והמנוסה</span> שלנו, המורכב ממכונאים מוסמכים ואנשי שירות שיודעים להעניק יחס אישי לכל לקוח.<br/>
                      אצלנו, <strong>כל רכב מקבל את מלוא תשומת הלב</strong>, מתוך מטרה להחזיר אותך לכביש במהירות, בבטיחות ובשקט נפשי.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* החזון שלנו - כרטיס מעוצב */}
          <div className="row justify-content-center mt-5">
            <div className="col-md-10">
              <div className="service-card">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center">
                    <img 
                      src="/img/ABOUT1.png" 
                      alt="החזון שלנו" 
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-8 text-end">
                    <h4 className="card-title">החזון שלנו</h4>
                    <p className="card-text">
                      <span className="highlight-text">המוסך שלנו</span> הוקם מתוך אמונה שהלקוח תמיד במקום הראשון.<br/>
                      אנו שואפים לשנות את חוויית השירות בענף הרכב ולהעניק לכל אחד <strong>פתרון מקצועי, הוגן ושקוף.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* קריאה לפעולה */}
          <div className="call-to-action mt-5">
            <p className="lead4">
              📍 <strong>בואו לבקר אותנו</strong> – אנחנו כאן כדי לדאוג לרכב שלכם ולוודא שתצאו מרוצים, בכל נסיעה מחדש!
            </p>
            <a href="/contact" className="btn btn-primary">📞 צרו קשר עכשיו</a>
          </div>

        </div>
      </section>
      <ChatBot/>
      <Footer />
    </>
  );
}

export default About;
