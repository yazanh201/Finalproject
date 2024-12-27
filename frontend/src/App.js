import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'; // ייבוא ברירת מחדל
import About from './Pages/About';
import Contact from './Pages/Contact';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
