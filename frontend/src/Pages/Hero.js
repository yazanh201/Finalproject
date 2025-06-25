import React from 'react';
import './cssfiles/Hero.css';
import ModelViewer from '../components/ModelViewer';

function Hero() {
  return (
    <section className="hero-section">
  <div className="hero-content">
    <h1>ברוכים הבאים למוסך שירות מהיר</h1>
    <p>השותף המהימן שלכם לתחזוקה ותיקון רכבים</p>
    <a href="/Contact" className="btn btn-light btn-lg mt-3">צור קשר</a>
  </div>

  <div className="hero-model">
    <ModelViewer
      url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
    />
  </div>
</section>

  );
}

export default Hero;
