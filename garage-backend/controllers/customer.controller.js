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
  
      // יצירת רכבים בצורה מסודרת עם cd garage-backend
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

// ייצוא כל הפונקציות לשימוש בקובץ ה-routes
module.exports = {
  addCustomer,
  getAllCustomers,
  searchCustomer,
  updateCustomer,
};
