import React from 'react';
import './Hero.css'; // ייבוא קובץ ה-CSS

function Hero() {
  return (
    <section className="hero d-flex align-items-center justify-content-center">
      <div className="text-center text-white">
        <h1 className="display-4">ברוכים הבאים למוסך MotorSport</h1>
        <p className="lead">השותף המהימן שלכם לתחזוקה ותיקון רכבים</p>
        <a href="/services" className="btn btn-light btn-lg mt-3"> הזמן תור</a>
      </div>
    </section>
  );
}

export default Hero;
