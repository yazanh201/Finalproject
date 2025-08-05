import React, { useState } from "react";
import AddCustomerStep from "./AddCustomer";  // קומפוננטת שלב 1 - טופס לקוח
import AddVehicleStep from "./AddVehicle";    // קומפוננטת שלב 2 - טופס רכב
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// קומפוננטה לניהול תהליך הוספת לקוח ורכב בשני שלבים
const AddCustomerWithVehicle = () => {
  const [step, setStep] = useState(1); // ניהול שלבים: 1 = לקוח, 2 = רכב
  const [customerData, setCustomerData] = useState(null); // שמירת נתוני לקוח מהשלב הראשון
  const [vehicleData, setVehicleData] = useState(null);   // שמירת נתוני רכב מהשלב השני
  const navigate = useNavigate(); // עבור ניווט בין דפים

  // ✅ שלב 1 - שליחה של נתוני הלקוח
  const handleCustomerSubmit = (data) => {
    setCustomerData(data); // שמירת הנתונים
    setStep(2); // מעבר לשלב הרכב
  };

  // ✅ שלב 2 - שליחה של נתוני הרכב והוספה למסד הנתונים
  const handleVehicleSubmit = async (vehicle) => {
    setVehicleData(vehicle); // שמירת נתוני הרכב

    try {
      // 🔍 בדיקה אם לקוח כבר קיים לפי שם או ת"ז
      const checkCustomer = await axios.get(
        `http://localhost:5000/api/customers/check?name=${customerData.name}&idNumber=${customerData.idNumber}`
      );
      if (checkCustomer.data.exists) {
        toast.error("❌ לקוח עם שם זה או תעודת זהות זו כבר קיים במערכת.");
        return;
      }

      // 🔍 בדיקה אם הרכב כבר קיים לפי מספר רכב
      const checkVehicle = await axios.get(
        `http://localhost:5000/api/cars/check?vehicleNumber=${vehicle.vehicleNumber}`
      );
      if (checkVehicle.data.exists) {
        toast.error(`❌ רכב עם מספר ${vehicle.vehicleNumber} כבר קיים במערכת.`);
        return;
      }

      // ✅ הוספת הלקוח למסד הנתונים
      const customerRes = await axios.post("http://localhost:5000/api/customers", customerData);
      const customerId = customerRes.data._id; // שמירת מזהה הלקוח החדש

      // ✅ הוספת הרכב עם קישור ללקוח באמצעות customerId
      const vehicleWithCustomer = { ...vehicle, customerId };
      await axios.post("http://localhost:5000/api/vehicles", vehicleWithCustomer);

      // הודעת הצלחה וניווט חזרה לרשימת הלקוחות
      toast.success("✅ הלקוח והרכב נוספו בהצלחה!");
      navigate("/customers");

    } catch (error) {
      // טיפול בשגיאות מהשרת
      console.error("❌ שגיאה:", error);
      const msg =
        error.response?.data?.message ||
        "❌ ארעה שגיאה בהוספת הלקוח או הרכב.";
      toast.error(msg);
    }
  };

  // רינדור בהתאם לשלב בתהליך: לקוח או רכב
  return (
    <div>
      {step === 1 && (
        <AddCustomerStep
          customerData={customerData}
          onNext={handleCustomerSubmit} // מעבר לשלב 2
        />
      )}
      {step === 2 && (
        <AddVehicleStep
          vehicleData={vehicleData}
          onBack={() => setStep(1)} // חזרה לשלב 1
          onSubmit={handleVehicleSubmit} // סיום תהליך
        />
      )}
    </div>
  );
};

export default AddCustomerWithVehicle;
