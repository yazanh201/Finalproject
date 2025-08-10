import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables"; // קומפוננטת טבלה כללית להצגת נתונים
import { useNavigate } from "react-router-dom"; // hook לניווט בין עמודים
import { FaFileInvoice, FaSearch } from "react-icons/fa"; // אייקונים עבור כפתורים

// קומפוננטה להצגת טבלת חשבוניות, עם אפשרויות חיפוש וסינון
const InvoicesTable = ({ onClose }) => {
  const navigate = useNavigate(); // מאפשר ניווט לתצוגת חשבונית
  const [invoices, setInvoices] = useState([]); // שמירת כלל החשבוניות
  const [searchTerm, setSearchTerm] = useState(""); // טקסט החיפוש
  const [showSearch, setShowSearch] = useState(false); // האם להציג את שדה החיפוש
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false); // האם להציג רק חשבוניות שלא שולמו

  // בקשת GET מהשרת לשליפת החשבוניות
  useEffect(() => {
    fetch("https://garage-backend-o8do.onrender.com/api/invoices")
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error("❌ שגיאה בשליפת חשבוניות:", err));
  }, []);

  // סינון החשבוניות לפי שם לקוח / מספר רכב + סטטוס תשלום
  const filteredInvoices = invoices
    .filter(inv =>
        inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.carPlate?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(inv => (showUnpaidOnly ? !inv.isPaid : true)); // רק חשבוניות לא משולמות אם נבחר

  // כותרות עמודות הטבלה
  const tableHeaders = [
    "שם לקוח",
    "מספר רכב",
    "סה\"כ לתשלום",
    "סטטוס תשלום",
    "צפייה בחשבונית"
  ];

  // המרת הנתונים לפורמט טבלה מוצג
  const tableData = filteredInvoices.map(inv => ({
    "שם לקוח": inv.customerName || "—",
    "מספר רכב": inv.carPlate || "—",
    "סה\"כ לתשלום": inv.totalWithVAT ? `${inv.totalWithVAT} ₪` : "—",

    // הצגת סטטוס תשלום בצבע (ירוק: שולם / אדום: לא שולם)
    "סטטוס תשלום": (
      <span style={{ 
        color: inv.isPaid ? "green" : "red", 
        fontWeight: "bold" 
      }}>
        {inv.isPaid ? "שולם" : "לא שולם"}
      </span>
    ),

    // כפתור ניווט לחשבונית לפי מזהה טיפול
    "צפייה בחשבונית": (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => navigate(`/invoice/${inv.treatmentId}`)}
      >
        <FaFileInvoice size={16} /> חשבונית
      </button>
    )
  }));

  return (
    <div>
      {/* כפתור לפתיחת שדה חיפוש וסינון תשלום */}
      <div className="mb-3 pt-5" style={{ direction: "rtl" }}>
        <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => setShowSearch(prev => !prev)} // הצגת שדה חיפוש
        >
            <FaSearch /> חיפוש חשבונית
        </button>

        <button 
            className={`btn ${showUnpaidOnly ? 'btn-danger' : 'btn-outline-danger'} me-2`}
            onClick={() => setShowUnpaidOnly(prev => !prev)} // הצגת רק חשבוניות שלא שולם
        >
            {showUnpaidOnly ? "הצג את כל החשבוניות" : "הצג רק שלא שולם"}
        </button>

        {/* שדה חיפוש לפי שם לקוח או מספר רכב */}
        {showSearch && (
            <input
              type="text"
              placeholder="🔍 חפש לפי שם לקוח או מספר רכב"
              className="form-control mt-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        )}
      </div>

      {/* הצגת הטבלה עם כל החשבוניות לאחר סינון */}
      <DashboardTables
        tableTitle="📄 חשבוניות"
        tableHeaders={tableHeaders}
        tableData={tableData}
        onClose={onClose}
      />
    </div>
  );
};

export default InvoicesTable;
