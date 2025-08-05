import { useState, useEffect } from "react";

// ✅ הוק מותאם אישית לניהול התראות (Notifications) מתמשכות ומקומיות
const useNotifications = () => {
  // ⬅️ רשימת ההתראות הפעילות (state פנימי)
  const [activeNotifications, setActiveNotifications] = useState([]);

  // ⏳ בעת טעינת הקומפוננטה – טוען התראות תקפות מה-localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];

    const now = Date.now();
    const valid = saved.filter(n => now - n.timestamp < 12 * 60 * 60 * 1000); // התראות שגילן קטן מ-12 שעות

    setActiveNotifications(valid);
    localStorage.setItem("activeNotifications", JSON.stringify(valid)); // עדכון אחסון מקומי
  }, []);

  // ✅ הוספת התראה לפי סוג (type), עם מניעת כפילויות לפי סוג בלבד
  const addNotification = (type, data) => {
    const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];

    // אם כבר קיימת התראה מהסוג הזה – לא מוסיפים שוב
    if (saved.some(n => n.type === type)) {
      return;
    }

    // יצירת הודעה לפי סוג
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

    // ⏱️ הסרה אוטומטית לאחר 12 שעות
    setTimeout(() => {
      removeNotification(type);
    }, 12 * 60 * 60 * 1000);
  };

  // ❌ הסרת התראה לפי סוג
  const removeNotification = (type) => {
    const saved = JSON.parse(localStorage.getItem("activeNotifications")) || [];

    const updated = saved.filter(n => n.type !== type);

    setActiveNotifications(updated);
    localStorage.setItem("activeNotifications", JSON.stringify(updated));
  };

  // 🔄 בדיקה יזומה של טיפולים שהסתיימו ב־24 שעות האחרונות
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
        // פרטים להצגה
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
        // אם אין טיפולים – מסירים התראה קיימת מסוג זה
        const updated = saved.filter(n => n.type !== "completedTreatments");
        setActiveNotifications(updated);
        localStorage.setItem("activeNotifications", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("❌ שגיאה בבדיקת טיפולים שהסתיימו:", error);
    }
  };

  // 🔁 מחזיר את הפונקציות הדרושות למשתמש בהוק
  return {
    activeNotifications,
    addNotification,
    removeNotification,
    fetchCompletedTreatments
  };
};

export default useNotifications;
