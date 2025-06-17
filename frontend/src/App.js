import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import Services from './Pages/Services';
import ServicesPage from './Pages/ServicesPage';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import About from './Pages/About';
import AdvancedDashboard from "./Pages/advanceddashboard/AdvancedDashboard"; 
import ChatBot from "./components/ChatBot";
import TreatmentsTable from "./Tabels/TreatmentsTable";
import TreatmentDetails from './components/TreatmentDetails';
import CreateTreatment from './components/CreateTreatment';
import CustomerVehicles from './components/CustomerVehicles';
import NewAppointmentForm from './components/AppointmentsForm';
import InvoicePage from './components/InvoicePage';
// ⚠️ ודא שזה קומפוננטה, אחרת הסר או שנה את השימוש
// import RecommendedCars from './hooks/useRecommendedCars'; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ServicesPage" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/About" element={<About />} />

        {/* ⚠️ הוסר RecommendedCars כי הוא ככל הנראה אינו קומפוננטה תקפה */}
        {/* <Route path="/RecommendedCars" element={<RecommendedCars />} /> */}

        <Route path="/AppointmentForm" element={<NewAppointmentForm />} />
        <Route path="/appointments/edit/:id" element={<NewAppointmentForm />} />
        <Route path="/treatment/:id" element={<TreatmentDetails />} />
        <Route path="/treatments" element={<TreatmentsTable />} />
        <Route path="/customer-vehicles/:customerId" element={<CustomerVehicles />} />
        <Route path="/AdvancedDashboard" element={<AdvancedDashboard />} />
        <Route path="/create-treatment" element={<CreateTreatment />} />
        <Route path="/invoice/:treatmentId" element={<InvoicePage />} />        
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* הוספת הצ'אט לכל העמודים */}
      <ChatBot />
    </>
  );
}

export default App;
