// 📁 routes/invoice.routes.js
const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoiceByTreatmentId,
  updateInvoiceByTreatmentId // ← הוספה
} = require("../controllers/invoice.controller");

// יצירת חשבונית חדשה
router.post("/", createInvoice);

// שליפת חשבונית לפי מזהה טיפול
router.get("/by-treatment/:treatmentId", getInvoiceByTreatmentId);

// 🔄 עדכון חשבונית קיימת לפי מזהה טיפול
router.put("/:treatmentId", updateInvoiceByTreatmentId);

module.exports = router;
