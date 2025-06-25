import React, { useState } from "react";
import AddCustomerStep from "./AddCustomer";
import AddVehicleStep from "./AddVehicle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCustomerWithVehicle = () => {
  const [step, setStep] = useState(1); // 1 = לקוח, 2 = רכב
  const [customerData, setCustomerData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const navigate = useNavigate();

  // שלב 1 - סיום מילוי טופס לקוח
  const handleCustomerSubmit = (data) => {
    setCustomerData(data);
    setStep(2);
  };

  // שלב 2 - סיום מילוי טופס רכב
  const handleVehicleSubmit = async (vehicle) => {
    setVehicleData(vehicle);

    try {
      // שליחת בקשה לשרת להוספת לקוח
      const customerRes = await axios.post("http://localhost:5000/api/customers", customerData);
      const customerId = customerRes.data._id;

      // שליחת בקשה להוספת רכב עם קישור ללקוח
      const vehicleWithCustomer = { ...vehicle, customerId };
      await axios.post("http://localhost:5000/api/vehicles", vehicleWithCustomer);

      alert("✅ הלקוח והרכב נוספו בהצלחה!");
      navigate("/customers");
    } catch (error) {
      console.error("❌ שגיאה:", error);
      alert("❌ ארעה שגיאה בהוספת הלקוח או הרכב.");
    }
  };

  return (
    <div>
      {step === 1 && (
        <AddCustomerStep
            customerData={customerData}
            onNext={handleCustomerSubmit} // ✅ זה השם הנכון
        />
        )}
      {step === 2 && (
        <AddVehicleStep
          vehicleData={vehicleData}
          onBack={() => setStep(1)}
          onSubmit={handleVehicleSubmit}
        />
      )}
    </div>
  );
};

export default AddCustomerWithVehicle;
