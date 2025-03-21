import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import Services from './Pages/Services';
import ServicesPage from './Pages/ServicesPage';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import About from './Pages/About';
import AdvancedDashboard from "./Pages/AdvancedDashboard"; // ✅ נכון
import RecommendedCars from './recommendations/RecommendedCars';
import ChatBot from "./components/ChatBot"; // ייבוא רכיב הצ'אט





function App() {

  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ServicesPage" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Services" element={<Services />} />
        <Route path='/Login' element={<Login/>} />
        <Route path="/About" element={<About />} />
        <Route path="/RecommendedCars" element={<RecommendedCars />} /> 
        <Route path="/AdvancedDashboard" element={<AdvancedDashboard />} />
        <Route
            path="/Dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
      </Routes>

      {/* הוספת הצ'אט שיופיע בכל העמודים */}
    </>
  );
}

export default App;



