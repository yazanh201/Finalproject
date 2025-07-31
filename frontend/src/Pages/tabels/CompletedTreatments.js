import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables";
import { useNavigate } from "react-router-dom";
import { FaEye, FaFileInvoice } from "react-icons/fa";

const CompletedTreatments = ({ onClose }) => {
  const [completedTreatments, setCompletedTreatments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedTreatments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/treatments");
        const data = await res.json();
        const today = new Date().toISOString().slice(0, 10);

        const completedToday = data.filter(
          (t) =>
            t.status === "הסתיים" &&
            new Date(t.updatedAt).toISOString().slice(0, 10) === today
        );

        setCompletedTreatments(completedToday);
      } catch (error) {
        console.error("❌ שגיאה בשליפת טיפולים שהסתיימו:", error);
      }
    };

    fetchCompletedTreatments();
  }, []);

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

  const tableData = completedTreatments.map((treatment) => ({
    "מזהה טיפול": treatment.treatmentNumber,
    "רכב": treatment.carPlate,
    "לקוח": treatment.customerName,
    "תיאור": treatment.description,
    "תאריך עדכון": new Date(treatment.updatedAt).toLocaleDateString("he-IL"),
    "חשבונית": (
      <button
        className="btn btn-outline-success btn-sm"
        onClick={() => navigate(`/invoice/${treatment._id}`)}
        title="צפייה בחשבונית"
      >
        <FaFileInvoice size={18} /> חשבונית
      </button>
    ),
    "צפייה": (
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => navigate(`/treatment/${treatment._id}`)}
        title="צפייה בפרטי הטיפול"
      >
        <FaEye size={18} />
      </button>
    ),
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

  return (
    <DashboardTables
      tableTitle="📅 טיפולים שהסתיימו היום"
      tableHeaders={tableHeaders}
      tableData={tableData}
      onClose={onClose}
    />
  );
};

export default CompletedTreatments;
