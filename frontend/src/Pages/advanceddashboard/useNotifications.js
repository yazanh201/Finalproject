import { useState, useEffect } from "react";

const useNotifications = () => {
  const [activeNotifications, setActiveNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];
    const now = Date.now();
    const valid = saved.filter(n => now - n.timestamp < 12 * 60 * 60 * 1000);
    setActiveNotifications(valid);
    localStorage.setItem("activeNotifications", JSON.stringify(valid)); // ← הוספה
    }, []);


  const addNotification = (type, data) => {
    const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];
    if (saved.some(n => n.type === type)) { // בדיקה לפי סוג בלבד
      return;
    }

    const notificationToAdd = {
      message: type === "completedTreatments"
        ? "✅ טיפולים הסתיימו היום"
        : "🔧 רכב נכנס לטיפול",
      type,
      data,
      timestamp: Date.now()
    };

    const updatedNotifications = [...saved, notificationToAdd];
    setActiveNotifications(updatedNotifications);
    localStorage.setItem("activeNotifications", JSON.stringify(updatedNotifications));

    setTimeout(() => {
      removeNotification(type);
    }, 12 * 60 * 60 * 1000);
  };

  const removeNotification = (type) => {
    const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];
    const updated = saved.filter(n => n.type !== type);
    setActiveNotifications(updated);
    localStorage.setItem("activeNotifications", JSON.stringify(updated));
  };

  const fetchCompletedTreatments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/treatments");
      const data = await res.json();

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      const completedRecent = data.filter(t =>
        t.status === "הסתיים" &&
        (new Date(t.updatedAt).toISOString().slice(0, 10) === today ||
        new Date(t.updatedAt).toISOString().slice(0, 10) === yesterday)
      );

      const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];

      if (completedRecent.length > 0) {
        const treatmentDetails = completedRecent.map(t => ({
          מזהה: t.treatmentNumber,
          רכב: t.carPlate,
          לקוח: t.customerName
        }));

        const exists = saved.some(n => n.type === "completedTreatments");
        if (!exists) {
          const newNotification = {
            message: `✅ ${completedRecent.length} טיפולים הסתיימו ב־24 שעות האחרונות`,
            type: "completedTreatments",
            data: { details: treatmentDetails },
            timestamp: Date.now()
          };

          const updatedNotifications = [...saved, newNotification];
          setActiveNotifications(updatedNotifications);
          localStorage.setItem("activeNotifications", JSON.stringify(updatedNotifications));
        }
      } else {
        const updated = saved.filter(n => n.type !== "completedTreatments");
        setActiveNotifications(updated);
        localStorage.setItem("activeNotifications", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("❌ שגיאה בבדיקת טיפולים שהסתיימו:", error);
    }
  };
  


  return { activeNotifications, addNotification, removeNotification, fetchCompletedTreatments };
};

export default useNotifications;
