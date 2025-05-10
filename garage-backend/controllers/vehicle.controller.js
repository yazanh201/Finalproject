const Vehicle = require('../models/Vehicle');

// 📌 הוספת רכב חדש
const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, owner, ownerID, brand, model, year, color, mileage } = req.body;

    const newVehicle = new Vehicle({
        vehicleNumber: vehicleNumber || '',
        owner: owner || '',
        ownerID: ownerID || '',
        brand: brand || '',
        model: model || '',
        year: year || 0,
        color: color || '',
        mileage: mileage || 0,
      });

    await newVehicle.save();

    res.status(201).json({ message: '✅ רכב נוסף בהצלחה', vehicle: newVehicle });
  } catch (error) {
    console.error('❌ שגיאה בהוספת רכב:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📌 שליפת כל הרכבים
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('❌ שגיאה בשליפת רכבים:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📌 חיפוש רכב לפי מספר רכב או ת"ז בעלים
const searchVehicle = async (req, res) => {
  try {
    const { query } = req.query;

    const vehicles = await Vehicle.find({
      $or: [
        { vehicleNumber: { $regex: query, $options: 'i' } },
        { ownerID: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error('❌ שגיאה בחיפוש רכב:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📌 עדכון פרטי רכב לפי ID
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: '❌ רכב לא נמצא' });
    }

    res.status(200).json({ message: '✅ רכב עודכן בהצלחה', vehicle: updatedVehicle });
  } catch (error) {
    console.error('❌ שגיאה בעדכון רכב:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📌 מחיקת רכב לפי ID
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: '❌ רכב לא נמצא למחיקה' });
    }

    res.status(200).json({ message: '✅ רכב נמחק בהצלחה' });
  } catch (error) {
    console.error('❌ שגיאה במחיקת רכב:', error.message);
    res.status(500).json({ message: '❌ שגיאה בשרת', error: error.message });
  }
};

// 📤 ייצוא הפונקציות
module.exports = {
  addVehicle,
  getAllVehicles,
  searchVehicle,
  updateVehicle,
  deleteVehicle,
};
