// ✅ Hook מותאם אישית לשליפת רכבים שדורשים טיפול לפי זמן או קילומטראז'

// ייבוא React hooks
import { useState, useEffect } from "react";

const useRecommendedCars = () => {
  // שמירת רשימת רכבים שמומלץ לטפל בהם
  const [recommendedCars, setRecommendedCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ שליפת כל הרכבים וכל הלקוחות במקביל
        const [vehiclesRes, customersRes] = await Promise.all([
          fetch("http://localhost:5000/api/cars"),
          fetch("http://localhost:5000/api/customers"),
        ]);
        const vehicles = await vehiclesRes.json();
        const customers = await customersRes.json();

        const today = new Date(); // התאריך הנוכחי

        // מעבר על כל רכב לחישוב המלצה
        const recommendations = await Promise.all(
          vehicles.map(async (vehicle) => {
            // ✅ שליפת כל הטיפולים לפי מספר רכב
            const treatmentsRes = await fetch(
              `http://localhost:5000/api/treatments/by-car/${vehicle.vehicleNumber}`
            );
            const treatments = await treatmentsRes.json();

            // אם אין טיפולים בכלל, אין המלצה
            if (treatments.length === 0) return null;

            // מציאת התאריך האחרון של טיפול
            const lastTreatment = treatments.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )[0];

            const lastServiceDate = new Date(lastTreatment.date);

            // ✅ חישוב חודשים מאז טיפול אחרון
            const monthsSinceService =
              (today.getFullYear() - lastServiceDate.getFullYear()) * 12 +
              (today.getMonth() - lastServiceDate.getMonth());

            // ✅ חישוב ק"מ ממוצע לשנה והערכת ק"מ מצטבר
            const vehicleAgeInYears = Math.max(today.getFullYear() - vehicle.year, 1);
            const avgKmPerYear = vehicle.mileage / vehicleAgeInYears;
            const estimatedKmAtTreatment = avgKmPerYear * (monthsSinceService / 12);
            const kmSinceService = estimatedKmAtTreatment;
            const currentcalculated = vehicle.mileage + kmSinceService;

            // ✅ מציאת לקוח לפי מספר הרכב (מתוך מערך רכבים אצל לקוח)
            let matchedCustomer = customers.find(c =>
              c.vehicles && c.vehicles.some(vNum =>
                String(vNum).trim() === String(vehicle.vehicleNumber).trim()
              )
            );

            // ✅ fallback – אם לא נמצא לפי מערך רכבים, בדיקה לפי ownerId
            if (!matchedCustomer && vehicle.ownerId) {
              matchedCustomer = customers.find(c => String(c._id) === String(vehicle.ownerId));
            }

            console.log("🔍 רכב:", vehicle.vehicleNumber, "לקוח שנמצא:", matchedCustomer);

            // ✅ קביעת שם בעלים ומספר טלפון להצגה
            const ownerName = matchedCustomer && matchedCustomer.fullName
              ? matchedCustomer.fullName
              : vehicle.ownerName || "לא נמצא";

            const phoneNumber = matchedCustomer && matchedCustomer.phone
              ? matchedCustomer.phone
              : "לא נמצא";

            // ✅ קריטריונים להצעת טיפול: יותר מ־6 חודשים או יותר מ־15,000 ק"מ
            const needsService =
              monthsSinceService >= 6 || kmSinceService >= 15000;

            return needsService
              ? {
                  "מספר רכב": vehicle.vehicleNumber,
                  "שם בעלים": ownerName,
                  "טלפון בעלים": phoneNumber !== "לא נמצא"
                    ? (
                        <a
                          href={`https://wa.me/972${phoneNumber.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "green", fontWeight: "bold" }}
                        >
                          {phoneNumber}
                        </a>
                      )
                    : "לא נמצא",
                  "שנת ייצור": vehicle.year,
                  "קילומטראז' אחרון": vehicle.mileage,
                  "קילומטראז' מחושב": Math.round(currentcalculated),
                  "חודשים מאז טיפול": monthsSinceService,
                  "תאריך טיפול אחרון": lastServiceDate.toLocaleDateString(),
                }
              : null; // אין המלצה אם לא עונה על הקריטריונים
          })
        );

        // סינון המלצות תקפות (לא null)
        setRecommendedCars(recommendations.filter(Boolean));
      } catch (err) {
        console.error("❌ שגיאה בשליפת המלצות:", err);
      }
    };

    // קריאה לפונקציה עם טעינת הקומפוננטה
    fetchData();
  }, []);

  // החזרת מערך ההמלצות
  return recommendedCars;
};

export default useRecommendedCars;
