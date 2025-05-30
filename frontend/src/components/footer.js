import React from 'react';
import './cssfiles/footer.css'; // ייבוא קובץ ה-CSS לעיצוב

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
              <strong>כתובת:</strong> גיימס ווט 9 , חיפה
            </p>
            <p>
              <strong>טלפון:</strong> +972 0499301
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
            <h4 className='mt-5 text-end'>מפת המוסך</h4>
            <iframe
              title="Google Map"
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.2196283230674!2d35.068256999999996!3d32.8129452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151db0ccee362cc3%3A0xca26975bcb5cda07!2z15In15nXmdee16Eg15XXldeYLCDXl9eZ16TXlA!5e0!3m2!1siw!2sil!4v1741179475823!5m2!1siw!2sil" 
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
            <p>  כל הזכויות שמורות  מוסך שירות מהיר&copy; 2024</p>

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
