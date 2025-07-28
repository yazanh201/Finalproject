const Employee = require("../models/Employee");

// שליפת כל העובדים
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ fullName: 1 }); // מיון לפי שם לדוגמה
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בשליפת עובדים", error: err.message });
  }
};

// הוספת עובד
const addEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee({
      idNumber: req.body.idNumber,
      fullName: req.body.fullName,
      role: req.body.role,
      email: req.body.email,
      phone: req.body.phone,
      status: req.body.status || "פעיל",
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בהוספה", error: err.message });
  }
};

// עדכון עובד
const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בעדכון", error: err.message });
  }
};


// חיפוש לפי ת״ז או שם
const searchEmployee = async (req, res) => {
  try {
    const search = req.params.term;
    const results = await Employee.find({
      $or: [
        { idNumber: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } }
      ]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בחיפוש", error: err.message });
  }
};

// 📌 מחיקת עובד לפי ID
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "❌ עובד לא נמצא למחיקה" });
    }
    res.status(200).json({ message: "✅ העובד נמחק בהצלחה" });
  } catch (error) {
    console.error("❌ שגיאה במחיקת עובד:", error.message);
    res.status(500).json({ message: "❌ שגיאה בשרת", error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee,
};
