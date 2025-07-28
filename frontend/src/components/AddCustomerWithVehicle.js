import React, { useState } from "react";
import AddCustomerStep from "./AddCustomer";
import AddVehicleStep from "./AddVehicle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddCustomerWithVehicle = () => {
  const [step, setStep] = useState(1); // 1 = לקוח, 2 = רכב
  const [customerData, setCustomerData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const navigate = useNavigate();

  // ✅ שלב 1 - קבלת פרטי לקוח
  const handleCustomerSubmit = (data) => {
    setCustomerData(data);
    setStep(2);
  };

  // ✅ שלב 2 - סיום והוספה למסד
  const handleVehicleSubmit = async (vehicle) => {
    setVehicleData(vehicle);

    try {
      // 🔍 בדיקה אם לקוח כבר קיים לפי שם או ת"ז
      const checkCustomer = await axios.get(`http://localhost:5000/api/customers/check?name=${customerData.name}&idNumber=${customerData.idNumber}`);
      if (checkCustomer.data.exists) {
        toast.error("❌ לקוח עם שם זה או תעודת זהות זו כבר קיים במערכת.");
        return;
      }

      // 🔍 בדיקה אם הרכב כבר קיים לפי מספר רכב
      const checkVehicle = await axios.get(`http://localhost:5000/api/cars/check?vehicleNumber=${vehicle.vehicleNumber}`);
      if (checkVehicle.data.exists) {
        toast.error(`❌ רכב עם מספר ${vehicle.vehicleNumber} כבר קיים במערכת.`);
        return;
      }

      // ✅ הוספת הלקוח
      const customerRes = await axios.post("http://localhost:5000/api/customers", customerData);
      const customerId = customerRes.data._id;

      // ✅ הוספת הרכב עם קישור ללקוח
      const vehicleWithCustomer = { ...vehicle, customerId };
      await axios.post("http://localhost:5000/api/vehicles", vehicleWithCustomer);

      toast.success("✅ הלקוח והרכב נוספו בהצלחה!");
      navigate("/customers");
    } catch (error) {
      console.error("❌ שגיאה:", error);
      const msg = error.response?.data?.message || "❌ ארעה שגיאה בהוספת הלקוח או הרכב.";
      toast.error(msg);
    }
  };

  return (
    <div>
      {step === 1 && (
        <AddCustomerStep
          customerData={customerData}
          onNext={handleCustomerSubmit}
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
