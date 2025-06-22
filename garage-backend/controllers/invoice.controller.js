// 📁 controllers/invoice.controller.js
const Invoice = require("../models/Invoice");
const Treatment = require("../models/Treatment");
const mongoose = require("mongoose");

// יצירת חשבונית
const createInvoice = async (req, res) => {
  try {
    const { treatmentId, items } = req.body;
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return res.status(404).json({ message: "טיפול לא נמצא" });

    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

    const invoice = new Invoice({
      treatmentId,
      customerName: treatment.customerName,
      customerIdNumber: treatment.idNumber,
      carPlate: treatment.carPlate,
      items,
      total
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error("❌ שגיאה ביצירת חשבונית:", err);
    res.status(500).json({ message: "שגיאה ביצירת חשבונית", error: err.message });
  }
};

// שליפת חשבונית לפי מזהה טיפול
const getInvoiceByTreatmentId = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ treatmentId: req.params.treatmentId });
    if (!invoice) return res.status(404).json({ message: "חשבונית לא נמצאה" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת חשבונית", error: err.message });
  }
};


const updateInvoiceByTreatmentId = async (req, res) => {
  const { treatmentId } = req.params;
  const { items } = req.body;

  try {
    // חישוב סה״כ וסה״כ כולל מע״מ
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const VAT_PERCENT = 17;
    const vatAmount = (total * VAT_PERCENT) / 100;
    const totalWithVAT = total + vatAmount;

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { treatmentId },
      {
        items,
        total,
        vatAmount,
        totalWithVAT
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "חשבונית לא נמצאה לעדכון" });
    }

    res.json(updatedInvoice);
  } catch (error) {
    console.error("❌ שגיאה בעדכון חשבונית:", error);
    res.status(500).json({ message: "שגיאה בעדכון חשבונית" });
  }
};

module.exports = {
  createInvoice,
  getInvoiceByTreatmentId,
  updateInvoiceByTreatmentId // ← הוסף כאן
};

module.exports = {
  createInvoice,
  getInvoiceByTreatmentId,
  updateInvoiceByTreatmentId
};