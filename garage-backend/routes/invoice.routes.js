const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoiceByTreatmentId,
  updateInvoiceByTreatmentId,
  getAllInvoices,
  updateInvoiceStatus
} = require("../controllers/invoice.controller");

// יצירת חשבונית חדשה
router.post("/", createInvoice);

// שליפת חשבונית לפי מזהה טיפול
router.get("/by-treatment/:treatmentId", getInvoiceByTreatmentId);

// 🔄 עדכון חשבונית קיימת לפי מזהה טיפול
router.put("/:treatmentId", updateInvoiceByTreatmentId);

router.get("/", getAllInvoices);

router.put("/:id/status", updateInvoiceStatus);



module.exports = router;
