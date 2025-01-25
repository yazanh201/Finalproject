import React from 'react';
import './footer.css'; // ייבוא קובץ ה-CSS לעיצוב

/**
 * רכיב Footer
 * רכיב זה מציג את החלק התחתון של האתר עם פרטי יצירת קשר, מפה, שורה תחתונה
 * ורשתות חברתיות.
 *
 * @component
 * @returns {JSX.Element} הרכיב המעוצב של ה-Footer להצגה בדף
 */
function Footer() {
  return (
    <footer className="footer text-white py-5">
      <div className="container">
        {/* חלוקה ל-2 עמודות */}
        <div className="row">
          {/* עמודת יצירת קשר */}
          <div className="col-md-6">
            <h4>צור קשר</h4>
            <p>
              <strong>כתובת:</strong> רחוב ראשי 123, עיר, מדינה
            </p>
            <p>
              <strong>טלפון:</strong> +972 50 123 4567
            </p>
            <h5>שעות פעילות:</h5>
            <ul className="list-unstyled">
              <li>ראשון - חמישי: 8:30 - 17:30</li>
              <li>שישי: 8:30 - 13:00</li>
              <li>שבת: סגור</li>
            </ul>
          </div>

          {/* עמודת מפה */}
          <div className="col-md-6">
            <h4>מפת המוסך</h4>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509406!2d144.95373531531695!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5779f30c0b90f1b!2sSMC%20Autos%20Garage!5e0!3m2!1sen!2sil!4v1700000000000"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* שורה תחתונה */}
        <div className="row mt-4">
          <div className="col text-center">
            {/* הודעת זכויות יוצרים */}
            <p>MotorSport, כל הזכויות שמורות &copy; 2024</p>

            {/* אייקונים של רשתות חברתיות */}
            <div className="social-icons mt-3">
              {/* אייקון פייסבוק */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <i className="bi bi-facebook fs-4"></i>
              </a>

              {/* אייקון אינסטגרם */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
              >
                <i className="bi bi-instagram fs-4"></i>
              </a>

              {/* אייקון Waze */}
              <a
                href="https://waze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="bi bi-geo-alt fs-4"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
