import React, { useEffect, useState } from "react";
// ✅ קומפוננטת הטבלה הכללית להצגת נתונים
import DashboardTables from "../advanceddashboard/DashboardTables";
// ✅ hook לניווט בין דפים באפליקציה
import { useNavigate } from "react-router-dom";
// ✅ אייקונים להצגה בלחצנים
import { FaEye, FaFileInvoice } from "react-icons/fa";

// ✅ קומפוננטה להצגת טיפולים שהסתיימו היום בלבד
const CompletedTreatments = ({ onClose }) => {
  const [completedTreatments, setCompletedTreatments] = useState([]); // סטייט לשמירת טיפולים שהסתיימו
  const navigate = useNavigate(); // ניווט בין עמודים

  // ⬅️ עם טעינת הקומפוננטה נשלוף את הטיפולים שהסתיימו היום
  useEffect(() => {
    const fetchCompletedTreatments = async () => {
      try {
        const res = await fetch("https://garage-backend-o8do.onrender.com/api/treatments");
        const data = await res.json();

        const today = new Date().toISOString().slice(0, 10); // תאריך היום (בפורמט YYYY-MM-DD)

        // ✅ סינון טיפולים שהסתיימו ושעודכנו היום
        const completedToday = data.filter(
          (t) =>
            t.status === "הסתיים" &&
            new Date(t.updatedAt).toISOString().slice(0, 10) === today
        );

        setCompletedTreatments(completedToday); // שמירת הטיפולים הרלוונטיים
      } catch (error) {
        console.error("❌ שגיאה בשליפת טיפולים שהסתיימו:", error);
      }
    };

    fetchCompletedTreatments(); // קריאה לפונקציה בעת טעינה
  }, []);

  // ✅ כותרות עמודות הטבלה
  const tableHeaders = [
    "מזהה טיפול",
    "רכב",
    "לקוח",
    "תיאור",
    "תאריך עדכון",
    "חשבונית",
    "צפייה",
    "עריכה"
  ];

  // ✅ מיפוי הנתונים של כל טיפול למבנה טבלה
  const tableData = completedTreatments.map((treatment) => ({
    "מזהה טיפול": treatment.treatmentNumber,
    "רכב": treatment.carPlate,
    "לקוח": treatment.customerName,
    "תיאור": treatment.description,
    "תאריך עדכון": new Date(treatment.updatedAt).toLocaleDateString("he-IL"), // תאריך מעוצב

    // כפתור צפייה בחשבונית
    "חשבונית": (
      <button
        className="btn btn-outline-success btn-sm"
        onClick={() => navigate(`/invoice/${treatment._id}`)}
        title="צפייה בחשבונית"
      >
        <FaFileInvoice size={18} /> חשבונית
      </button>
    ),

    // כפתור לצפייה בפרטי הטיפול
    "צפייה": (
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => navigate(`/treatment/${treatment._id}`)}
        title="צפייה בפרטי הטיפול"
      >
        <FaEye size={18} />
      </button>
    ),

    // כפתור לעריכת הטיפול – כולל העברת מידע דרך state
    "עריכה": (
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() =>
          navigate("/create-treatment", {
            state: {
              plateNumber: treatment.carPlate,
              customerName: treatment.customerName,
              idNumber: treatment.idNumber || "",
              workerName: treatment.workerName || "",
              cost: treatment.cost || "",
              date: treatment.date || "",
              description: treatment.description || "",
              status: treatment.status || "",
              treatmentId: treatment._id || "",
              repairTypeId: treatment.typeId || "",
              workerId: treatment.workerId || "",
              treatmentServices: treatment.treatmentServices || []
            }
          })
        }
        title="עריכת טיפול"
      >
        ✏️
      </button>
    )
  }));

  // ✅ הצגת הטבלה עם נתוני טיפולים שהסתיימו
  return (
    <DashboardTables
      tableTitle="📅 טיפולים שהסתיימו היום"
      tableHeaders={tableHeaders}
      tableData={tableData}
      onClose={onClose} // כפתור לסגירת התצוגה
    />
  );
};

export default CompletedTreatments;
