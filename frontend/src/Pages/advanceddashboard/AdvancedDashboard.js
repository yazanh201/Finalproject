import React, { useState, useEffect, useRef } from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import DashboardOverview from "./DashboardOverview";
import DashboardTables from "./DashboardTables";
import MonthlyAppointments from "../tabels/MonthlyAppointments";
import NewCustomers from "../tabels/NewCustomers";
import TodayAppointments from "../tabels/TodayAppointments";
import RevenueByRepairTypeChart from "./charts/RevenueByRepairTypeChart";
import TreatmentTypePieChart from "./charts/TreatmentTypePieChart";
import ArrivedCars from "../tabels/ArrivedCars";
import CompletedTreatments from "../tabels/CompletedTreatments";
import useNotifications from "./useNotifications";
import CarsUnderService from "../tabels/CarsUnderService";
import RecommendedCars from "../tabels/RecommendedCars";
import MonthlyRevenueTable from "../tabels/MonthlyRevenueTable";

const AdvancedDashboard = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const [stats, setStats] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableTitle, setTableTitle] = useState("");
  const [monthlyAppointmentCount, setMonthlyAppointmentCount] = useState(0);
  const [newCustomersCount, setNewCustomersCount] = useState(0);
  const [dynamicTableHeaders, setDynamicTableHeaders] = useState([]);
  const { activeNotifications, addNotification } = useNotifications();
  const [carsInServiceCount, setCarsInServiceCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, appointmentsRes, treatmentsRes] = await Promise.all([
          fetch("http://localhost:5000/api/customers/new-this-month"),
          fetch("http://localhost:5000/api/appointments/month"),
          fetch("http://localhost:5000/api/treatments")
        ]);

        const customersData = await customersRes.json();
        const appointmentsData = await appointmentsRes.json();
        const treatmentsData = await treatmentsRes.json();

        setNewCustomersCount(customersData.length);
        setMonthlyAppointmentCount(appointmentsData.length);

        const underServiceCount = treatmentsData.filter(t => t.status !== "הסתיים").length;
        setCarsInServiceCount(underServiceCount);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const thisMonthTreatments = treatmentsData.filter(t => {
          const treatmentDate = new Date(t.date);
          return (
            treatmentDate.getMonth() === currentMonth &&
            treatmentDate.getFullYear() === currentYear
          );
        });

        const totalRevenue = thisMonthTreatments.reduce((sum, t) => {
          return sum + (Number(t.cost) || 0);
        }, 0);
        setMonthlyRevenue(totalRevenue);

        // ✅ התראות על טיפולים שהסתיימו
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        const completedRecent = treatmentsData.filter(t =>
          t.status === "הסתיים" &&
          (new Date(t.updatedAt).toISOString().slice(0, 10) === today ||
           new Date(t.updatedAt).toISOString().slice(0, 10) === yesterday)
        );

        if (completedRecent.length > 0) {
          const details = completedRecent.map(t => ({
            מזהה: t.treatmentNumber,
            רכב: t.carPlate,
            לקוח: t.customerName
          }));
          addNotification("completedTreatments", { details });
        }

      } catch (error) {
        console.error("❌ Error loading stats:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setStats([
      { title: "סה״כ תורים לחודש", value: monthlyAppointmentCount, key: "appointments" },
      { title: "רכבים בטיפול", value: carsInServiceCount, key: "carsUnderService" },
      { title: "לקוחות חדשים", value: newCustomersCount, key: "newCustomers" },
      { title: "הכנסות החודש (₪)", value: monthlyRevenue, key: "income" }
    ]);
  }, [monthlyAppointmentCount, newCustomersCount, carsInServiceCount]);

  const showTable = (key) => {
    switch (key) {
      case "recommendedCars":
        setSelectedTable("recommendedCars");
        break;
      case "newCustomers":
        setSelectedTable("newCustomers");
        break;
      case "todayAppointments":
        setSelectedTable("todayAppointments");
        break;
      case "carsUnderService":
        setSelectedTable("carsUnderService");
        break;
      case "appointments":
        setSelectedTable("monthlyAppointments");
        break;
      case "income":
        setSelectedTable("monthlyRevenue");
        break;
      default:
        setTableData([]);
        setSelectedTable(null);
        break;
    }
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const tableHeaders = {
    recommendedCars: ["מספר רכב", "בעלים", "קילומטרים משוערים", "חודשים מהטיפול האחרון"],
    newCustomers: ["שם", "טלפון", "תאריך הצטרפות"],
    carsUnderMaintenance: ["רכב", "סיבה", "איחור", "לוחית"]
  };

  const handleNotificationClick = (type, data) => {
    if (type === "newTreatment") {
      setSelectedTable("arrivedCars");
    } else if (type === "completedTreatments") {
      setSelectedTable("completedTreatments");
    } else if (data) {
      setTableTitle("🔧 פרטי רכב שנכנס לטיפול");
      setDynamicTableHeaders(Object.keys(data));
      setTableData([data]);
      setSelectedTable("dynamic");
    } else {
      showTable(type);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h2 className={styles.headerTitle}>
          <span role="img" aria-label="dashboard"></span> לוח ניהול מתקדם
        </h2>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
          <FaArrowLeft className={styles.icon} /> חזור לדשבורד
        </button>
      </header>

      <aside className={styles.sidebar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <button className={styles.sidebarBtn} onClick={() => showTable("recommendedCars")}>
              <span role="img" aria-label="car"></span> רכבים מומלצים
            </button>
          </li>
          <li className={styles.navItem}>
            <button className={styles.sidebarBtn} onClick={() => showTable("todayAppointments")}>
              <span role="img" aria-label="calendar"></span> תורים להיום
            </button>
          </li>
          <li className={styles.navItem}>
            <button
              className={styles.sidebarBtn}
              onClick={() => navigate("/monthlyreport")}
            >
              <span role="img" aria-label="calendar"></span> דוח חודשי
            </button>
          </li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.chartsContainer}>
          <div className={styles.chartBox}>
            <TreatmentTypePieChart />
          </div>
          <div className={styles.chartBox}>
            <RevenueByRepairTypeChart />
          </div>
        </div>

        <DashboardOverview
          stats={stats}
          notifications={activeNotifications}
          onStatClick={showTable}
          onNotificationClick={(type, data) => handleNotificationClick(type, data)}
        />

        <div ref={tableRef}>
          {selectedTable === "monthlyAppointments" ? (
            <MonthlyAppointments onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "newCustomers" ? (
            <NewCustomers onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "todayAppointments" ? (
            <TodayAppointments onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "arrivedCars" ? (
            <ArrivedCars onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "completedTreatments" ? (
            <CompletedTreatments onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "carsUnderService" ? (
            <CarsUnderService onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "recommendedCars" ? (
            <RecommendedCars onClose={() => setSelectedTable(null)} />
          ) : selectedTable === "monthlyRevenue" ? (
            <MonthlyRevenueTable onClose={() => setSelectedTable(null)} />
          ) : (
            <DashboardTables
              tableTitle={tableTitle}
              tableData={tableData}
              tableHeaders={
                selectedTable === "dynamic"
                  ? dynamicTableHeaders
                  : tableHeaders[selectedTable]
              }
              onClose={() => setSelectedTable(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdvancedDashboard;
