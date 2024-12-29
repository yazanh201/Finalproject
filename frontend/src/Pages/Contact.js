import React from 'react';
/**
 * רכיב Contact
 * רכיב זה מציג את החלק של "צור קשר" בעמוד, כולל מידע ליצירת קשר עם המוסך
 * (כתובת, טלפון ואימייל) וטופס ליצירת קשר ישירות דרך האתר.
 * 
 * @returns {JSX.Element} - רכיב ה-Contact להצגה בדף
 */
function Contact() {
  return (

    
   
    <section className="contact bg-light py-5">
      <div className="container" >
        <h2 className="text-center mb-4">צור קשר</h2>
        <div className="row">
          {/* מידע ליצירת קשר */}
          <div className="col-md-6">
            <h4>כתובת</h4>
            <p>רחוב ראשי 123, עיר, מדינה</p>
            <h4>טלפון</h4>
            <p>+972 50 123 4567</p>
            <h4>אימייל</h4>
            <p>info@smcautos.com</p>
          </div>

          {/* טופס יצירת קשר */}
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">שם</label>
                <input type="text" className="form-control" id="name" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">אימייל</label>
                <input type="email" className="form-control" id="email" />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">הודעה</label>
                <textarea className="form-control" id="message" rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">שלח</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
