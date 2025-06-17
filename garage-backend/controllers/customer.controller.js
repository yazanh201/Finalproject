// ייבוא מודל הלקוח והרכב
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');

/**
 * 📌 פונקציה להוספת לקוח חדש
 * מקבלת נתונים מה-Frontend, יוצרת לקוח חדש,
 * ואם מספר הרכב לא קיים במסד – יוצרת גם רשומת רכב מינימלית.
 */
const addCustomer = async (req, res) => {
  try {
    let { name, idNumber, phone, email, status, vehicleNumber } = req.body;

    // ✅ בדיקה אם הלקוח כבר קיים לפי תעודת זהות
    const existingCustomer = await Customer.findOne({ idNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: "❌ לקוח עם תעודת זהות זו כבר קיים במערכת." });
    }

    let vehicles = [];
    if (Array.isArray(vehicleNumber)) {
      vehicles = vehicleNumber;
    } else if (typeof vehicleNumber === 'string') {
      vehicles = [vehicleNumber];
    }

    const newCustomer = new Customer({
      name,
      idNumber,
      phone,
      email,
      status,
      vehicles,
    });

    await newCustomer.save();

    // יצירת רכבים שלא קיימים עדיין
    for (const number of vehicles) {
      const existingVehicle = await Vehicle.findOne({ vehicleNumber: number });

      if (number && !existingVehicle) {
        const newVehicle = new Vehicle({
          vehicleNumber: number,
          ownerName: name,
          ownerIdNumber: idNumber,
          manufacturer: '',
          model: '',
          year: null,
          color: '',
          mileage: 0,
        });
        await newVehicle.save();
      }
    }

    res.status(201).json({ message: '✅ לקוח נוסף בהצלחה', customer: newCustomer });

  } catch (error) {
    console.error('❌ שגיאה בהוספת לקוח:', error.message);

    // ✅ טיפול בשגיאת Duplicate תעודת זהות אם תקרה מ־MongoDB
    if (error.code === 11000 && error.keyPattern?.idNumber) {
      return res.status(400).json({ message: "❌ לקוח עם תעודת זהות זו כבר קיים במערכת." });
    }

    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

  

/**
 * 📌 פונקציה לשליפת כל הלקוחות
 * מחזירה את כל הלקוחות הקיימים במסד הנתונים.
 */
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error('❌ שגיאה בשליפת לקוחות:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

/**
 * 📌 פונקציה לחיפוש לקוח לפי ת"ז או שם
 * מאפשרת לחפש לקוח לפי תעודת זהות או שם חלקי/מלא.
 */
const searchCustomer = async (req, res) => {
  try {
    const { query } = req.query; // מקבלים פרמטר מה-URL: ?query=משה

    if (!query) {
      return res.status(400).json({ message: 'יש לספק ת"ז או שם לחיפוש' });
    }

    // חיפוש גמיש: או לפי ת"ז או לפי שם (לא משנה רישיות)
    const customers = await Customer.find({
      $or: [
        { idNumber: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error('❌ שגיאה בחיפוש לקוחות:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

/**
 * 📌 פונקציה לעדכון לקוח קיים
 * מאפשרת לעדכן פרטים קיימים של לקוח לפי מזהה הלקוח (ID).
 */
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params; // מזהה הלקוח ב-URL
    const { name, idNumber, phone, email, status, vehicles } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, idNumber, phone, email, status, vehicles },
      { new: true } // מחזיר את המסמך החדש לאחר עדכון
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'לקוח לא נמצא' });
    }

    res.status(200).json({ message: '✅ לקוח עודכן בהצלחה', customer: updatedCustomer });
  } catch (error) {
    console.error('❌ שגיאה בעדכון לקוח:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};


const addCarToCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicleNumber } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "לקוח לא נמצא" });

    if (customer.vehicles.includes(vehicleNumber)) {
      return res.status(400).json({ message: "הרכב כבר משויך ללקוח זה" });
    }

    customer.vehicles.push(vehicleNumber);
    await customer.save();

    // יצירת רכב במסד אם הוא לא קיים
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (!existingVehicle) {
      const newVehicle = new Vehicle({
        vehicleNumber,
        ownerName: customer.name,
        ownerIdNumber: customer.idNumber,
        manufacturer: '',
        model: '',
        year: null,
        color: '',
        mileage: 0,
      });
      await newVehicle.save();
    }

    res.json({ message: "✅ רכב נוסף ללקוח", customer });
  } catch (error) {
    console.error("❌ שגיאה בהוספת רכב ללקוח:", error);
    res.status(500).json({ message: "❌ שגיאה בשרת", error: error.message });
  }
};

const getNewCustomersThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const customers = await Customer.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("❌ שגיאה בשליפת לקוחות חדשים:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

/**
 * 📌 שליפת תעודת זהות של לקוח לפי מספר רכב
 */
const getIdNumberByCarPlate = async (req, res) => {
  try {
    const { plateNumber } = req.params;

    if (!plateNumber) {
      return res.status(400).json({ message: "❌ חובה לציין מספר רכב" });
    }

    // חיפוש לקוח שמכיל את מספר הרכב ברשימת הרכבים שלו
    const customer = await Customer.findOne({ vehicles: plateNumber });

    if (!customer) {
      return res.status(404).json({ message: "❌ לקוח לא נמצא עם מספר רכב זה" });
    }

    return res.status(200).json({
      idNumber: customer.idNumber,
      name: customer.name,
    });
  } catch (error) {
    console.error("❌ שגיאה בשליפת תעודת זהות לפי מספר רכב:", error.message);
    return res.status(500).json({ message: "❌ שגיאה בשרת", error: error.message });
  }
};

/**
 * שליפת כתובת אימייל של לקוח לפי מספר רכב
 */
const getEmailByCarPlate = async (req, res) => {
  try {
    const { plateNumber } = req.params;

    if (!plateNumber) {
      return res.status(400).json({ message: "❌ חובה לציין מספר רכב" });
    }

    // חיפוש לקוח שמכיל את מספר הרכב במערך הרכבים
    const customer = await Customer.findOne({ vehicles: plateNumber });

    if (!customer) {
      return res.status(404).json({ message: "❌ לקוח לא נמצא עם מספר רכב זה" });
    }

    return res.status(200).json({
      email: customer.email,
      name: customer.name,
    });
  } catch (error) {
    console.error("❌ שגיאה בשליפת אימייל לפי מספר רכב:", error.message);
    return res.status(500).json({ message: "❌ שגיאה בשרת", error: error.message });
  }
};





// ייצוא כל הפונקציות לשימוש בקובץ ה-routes
module.exports = {
  addCustomer,
  getAllCustomers,
  searchCustomer,
  updateCustomer,
  addCarToCustomer,
  getNewCustomersThisMonth,
  getIdNumberByCarPlate,
  getEmailByCarPlate
};
