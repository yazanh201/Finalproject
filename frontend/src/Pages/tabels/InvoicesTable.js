import React, { useEffect, useState } from "react";
import DashboardTables from "../advanceddashboard/DashboardTables";
import { useNavigate } from "react-router-dom";
import { FaFileInvoice, FaSearch } from "react-icons/fa";

const InvoicesTable = ({ onClose }) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/invoices")
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error("❌ שגיאה בשליפת חשבוניות:", err));
  }, []);

  // ✅ סינון לפי שם לקוח או מספר רכב
  const filteredInvoices = invoices.filter(inv =>
    inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.carPlate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = ["שם לקוח", "מספר רכב", "סה\"כ לתשלום", "סטטוס תשלום", "צפייה בחשבונית"];

  const tableData = filteredInvoices.map(inv => ({
    "שם לקוח": inv.customerName || "—",
    "מספר רכב": inv.carPlate || "—",
    "סה\"כ לתשלום": inv.totalWithVAT ? `${inv.totalWithVAT} ₪` : "—",
    "סטטוס תשלום": (
      <span style={{ 
        color: inv.isPaid ? "green" : "red", 
        fontWeight: "bold" 
      }}>
        {inv.isPaid ? "שולם" : "לא שולם"}
      </span>
    ),
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
      {/* כפתור לפתיחת שדה חיפוש */}
      <div className="mb-3" style={{ direction: "rtl" }}>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => setShowSearch(prev => !prev)}
        >
          <FaSearch /> חיפוש
        </button>
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
