import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';
import ChatBot from '../components/ChatBot';
import axios from 'axios';

function Contact() {
  // סטייטים לשדות הטופס
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/inquiries', {
        name,
        email,
        phone,
        message,
      });

      alert('✅ הפנייה נשלחה בהצלחה!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('❌ שגיאה בשליחת הפנייה:', error.message);
      alert('❌ שגיאה בשליחת הפנייה');
    }
  };

  return (
    <>
      <Header />
      <section className="contact bg-light py-5">
        <div className="container">
          <div
            className="contact-wrapper"
            style={{
              border: '2px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="row">
              <div className="col-12 mb-4 me-1">
                <h2>צור קשר</h2>
              </div>
            </div>
            <div className="row">
              {/* טופס יצירת קשר */}
              <div className="col-md-6 order-md-0">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">שם</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">אימייל</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">טלפון</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">הודעה</label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">שלח</button>
                </form>
              </div>

              {/* מידע ליצירת קשר */}
              <div className="col-md-6 order-md-1 text-end">
                <h4>כתובת</h4>
                <p>רחוב ראשי 123, עיר, מדינה</p>
                <h4>טלפון</h4>
                <p>+972 50 123 4567</p>
                <h4>אימייל</h4>
                <p>info@smcautos.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ChatBot />
      <Footer />
    </>
  );
}

export default Contact;
