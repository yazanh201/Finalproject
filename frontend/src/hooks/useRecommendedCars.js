import { useState, useEffect } from "react";

const useRecommendedCars = () => {
  const [recommendedCars, setRecommendedCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // שליפת רכבים ולקוחות
        const [vehiclesRes, customersRes] = await Promise.all([
          fetch("http://localhost:5000/api/cars"),
          fetch("http://localhost:5000/api/customers"),
        ]);
        const vehicles = await vehiclesRes.json();
        const customers = await customersRes.json();

        const today = new Date();

        const recommendations = await Promise.all(
          vehicles.map(async (vehicle) => {
            // שליפת טיפולים לפי מספר רכב
            const treatmentsRes = await fetch(
              `http://localhost:5000/api/treatments/by-car/${vehicle.vehicleNumber}`
            );
            const treatments = await treatmentsRes.json();
            if (treatments.length === 0) return null;

            // טיפול אחרון
            const lastTreatment = treatments.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )[0];

            const lastServiceDate = new Date(lastTreatment.date);
            const monthsSinceService =
              (today.getFullYear() - lastServiceDate.getFullYear()) * 12 +
              (today.getMonth() - lastServiceDate.getMonth());

            // חישוב קילומטראז' מוערך
            const vehicleAgeInYears = Math.max(today.getFullYear() - vehicle.year, 1);
            const avgKmPerYear = vehicle.mileage / vehicleAgeInYears;
            const estimatedKmAtTreatment = avgKmPerYear * (monthsSinceService / 12);
            const kmSinceService = estimatedKmAtTreatment;
            const currentcalculated = vehicle.mileage + kmSinceService;

            // חיפוש טלפון בעל הרכב לפי ownerId
            const matchedCustomer = customers.find(c => c.ownerId === vehicle.ownerId);
            const phoneNumber = matchedCustomer ? matchedCustomer.phone : "לא נמצא";

            const needsService =
              monthsSinceService >= 6 || kmSinceService >= 15000;

            return needsService
              ? {
                  "מספר רכב": vehicle.vehicleNumber,
                  "שם בעלים": vehicle.ownerName,
                  "טלפון בעלים": phoneNumber,
                  "שנת ייצור": vehicle.year,
                  "קילומטראז' אחרון": vehicle.mileage,
                  "קילומטראז' מחושב": Math.round(currentcalculated),
                  "חודשים מאז טיפול": monthsSinceService,
                  "תאריך טיפול אחרון": lastServiceDate.toLocaleDateString(),
                }
              : null;
          })
        );

        setRecommendedCars(recommendations.filter(Boolean));
      } catch (err) {
        console.error("❌ שגיאה בשליפת המלצות:", err);
      }
    };

    fetchData();
  }, []);

  return recommendedCars;
};

export default useRecommendedCars;
