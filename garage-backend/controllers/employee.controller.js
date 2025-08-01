const Employee = require("../models/Employee");

// שליפת כל העובדים
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ fullName: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בשליפת עובדים", error: err.message });
  }
};

// הוספת עובד
const addEmployee = async (req, res) => {
  try {
    console.log("📥 POST /api/employees BODY:", req.body); // Debug

    const { idNumber, fullName, role, email, phone } = req.body;

    // ✅ ולידציה: בדיקה שכל השדות קיימים
    if (!idNumber || !fullName || !role || !email || !phone) {
      return res.status(400).json({ message: "❌ יש למלא את כל השדות" });
    }

    const newEmployee = new Employee({
      idNumber: String(idNumber).trim(),
      fullName: String(fullName).trim(),
      role: String(role).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
    });

    await newEmployee.save();

    console.log("✅ עובד נשמר בהצלחה:", newEmployee);
    res.status(201).json(newEmployee);

  } catch (err) {
    console.error("❌ שגיאה בהוספת עובד:", err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "❌ עובד עם תעודת זהות זו כבר קיים" });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "❌ שגיאת ולידציה", errors: messages });
    }

    res.status(500).json({ message: "❌ שגיאה בשרת", error: err.message });
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

// מחיקה
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
