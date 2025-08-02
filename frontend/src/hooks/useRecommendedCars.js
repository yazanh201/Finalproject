import { useState, useEffect } from "react";

const useRecommendedCars = () => {
  const [recommendedCars, setRecommendedCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, customersRes] = await Promise.all([
          fetch("http://localhost:5000/api/cars"),
          fetch("http://localhost:5000/api/customers"),
        ]);
        const vehicles = await vehiclesRes.json();
        const customers = await customersRes.json();

        const today = new Date();

        const recommendations = await Promise.all(
          vehicles.map(async (vehicle) => {
            const treatmentsRes = await fetch(
              `http://localhost:5000/api/treatments/by-car/${vehicle.vehicleNumber}`
            );
            const treatments = await treatmentsRes.json();
            if (treatments.length === 0) return null;

            const lastTreatment = treatments.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )[0];

            const lastServiceDate = new Date(lastTreatment.date);
            const monthsSinceService =
              (today.getFullYear() - lastServiceDate.getFullYear()) * 12 +
              (today.getMonth() - lastServiceDate.getMonth());

            const vehicleAgeInYears = Math.max(today.getFullYear() - vehicle.year, 1);
            const avgKmPerYear = vehicle.mileage / vehicleAgeInYears;
            const estimatedKmAtTreatment = avgKmPerYear * (monthsSinceService / 12);
            const kmSinceService = estimatedKmAtTreatment;
            const currentcalculated = vehicle.mileage + kmSinceService;

            // ✅ חיפוש לפי vehicles במודל לקוח
            let matchedCustomer = customers.find(c =>
              c.vehicles && c.vehicles.some(vNum =>
                String(vNum).trim() === String(vehicle.vehicleNumber).trim()
              )
            );

            // ✅ fallback לפי ownerId אם לא נמצא לפי vehicles
            if (!matchedCustomer && vehicle.ownerId) {
              matchedCustomer = customers.find(c => String(c._id) === String(vehicle.ownerId));
            }

            console.log("🔍 רכב:", vehicle.vehicleNumber, "לקוח שנמצא:", matchedCustomer);

            // ✅ שם הבעלים - קודם מהלקוח, אחרת מהרכב
            const ownerName = matchedCustomer && matchedCustomer.fullName
              ? matchedCustomer.fullName
              : vehicle.ownerName || "לא נמצא";

            const phoneNumber = matchedCustomer && matchedCustomer.phone
              ? matchedCustomer.phone
              : "לא נמצא";

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
