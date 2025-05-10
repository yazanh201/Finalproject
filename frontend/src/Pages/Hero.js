import React from 'react';
import './cssfiles/Hero.css'; // ייבוא קובץ ה-CSS
import Contact from './Contact';

function Hero() {
  return (
    <section className="hero d-flex align-items-center justify-content-center">
      <div className="text-center text-white" >
        <h1 className="display-4">  ברוכים הבאים למוסך שירות מהיר</h1>
        <p className="lead">השותף המהימן שלכם לתחזוקה ותיקון רכבים</p>
        <a href="/Contact" className="btn btn-light btn-lg mt-3"> צור קשר</a>
      </div>
    </section>
  );
}

export default Hero;
