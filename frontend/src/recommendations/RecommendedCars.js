import { useState, useEffect } from "react";

const useRecommendedCars = () => {
  const [recommendedCars, setRecommendedCars] = useState([]);

  useEffect(() => {
    const today = new Date();

    // נתונים מדומים של רכבים
    const cars = [
      {
        id: 1,
        owner: "ישראל כהן",
        plateNumber: "123-45-678",
        lastServiceDate: "2023-08-10",
        lastKm: 20000,
        avgMonthlyKm: 2000,
      },
      {
        id: 2,
        owner: "דני לוי",
        plateNumber: "987-65-432",
        lastServiceDate: "2023-06-15",
        lastKm: 45000,
        avgMonthlyKm: 1800,
      },
      {
        id: 3,
        owner: "מיכל לוי",
        plateNumber: "789-12-345",
        lastServiceDate: "2023-10-01",
        lastKm: 30000,
        avgMonthlyKm: 2200,
      },
    ];

    // חישוב רכבים שדורשים בדיקה
    const filteredCars = cars.map((car) => {
      const lastServiceDate = new Date(car.lastServiceDate);
      const monthsSinceService =
        (today.getFullYear() - lastServiceDate.getFullYear()) * 12 +
        (today.getMonth() - lastServiceDate.getMonth());
      const estimatedKm = car.lastKm + monthsSinceService * car.avgMonthlyKm;

      // קריטריונים להמלצה: אם עברו מעל 6 חודשים או אם עברו 15,000 ק"מ מאז הטיפול האחרון
      const needsService = monthsSinceService >= 6 || estimatedKm - car.lastKm >= 15000;

      return { ...car, monthsSinceService, estimatedKm, needsService };
    });

    setRecommendedCars(filteredCars.filter((car) => car.needsService));
  }, []);

  return recommendedCars;
};

export default useRecommendedCars;
