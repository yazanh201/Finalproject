const express = require("express");
const router = express.Router();
const { 
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee
} = require("../controllers/employee.controller");

// שליפת כל העובדים
router.get("/", getAllEmployees);

// חיפוש לפי תעודת זהות או שם
router.get("/search/:term", searchEmployee);

// הוספה
router.post("/", addEmployee);

// עדכון
router.put("/:id", updateEmployee);

// מחיקה
router.delete("/:id", deleteEmployee);

module.exports = router;
