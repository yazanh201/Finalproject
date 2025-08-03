// 📁 controllers/invoice.controller.js
const Invoice = require("../models/Invoice");
const Treatment = require("../models/Treatment");

// ✅ יצירת חשבונית חדשה
const createInvoice = async (req, res) => {
  try {
    const { treatmentId, items, isPaid } = req.body;

    // בדיקה שהטיפול קיים
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return res.status(404).json({ message: "טיפול לא נמצא" });

    // חישובי סכומים
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const VAT_PERCENT = 17;
    const vatAmount = (total * VAT_PERCENT) / 100;
    const totalWithVAT = total + vatAmount;

    // יצירת החשבונית
    const invoice = new Invoice({
      treatmentId,
      customerName: treatment.customerName,
      customerIdNumber: treatment.idNumber,
      carPlate: treatment.carPlate,
      items,
      total,
      vatAmount,
      totalWithVAT,
      isPaid: isPaid || false // ✅ שמירה אם שולם או לא
    });

    await invoice.save();

    // ✅ עדכון עלות הטיפול
    await Treatment.findByIdAndUpdate(treatmentId, { cost: Math.round(totalWithVAT) });

    res.status(201).json(invoice);
  } catch (err) {
    console.error("❌ שגיאה ביצירת חשבונית:", err);
    res.status(500).json({ message: "שגיאה ביצירת חשבונית", error: err.message });
  }
};

// ✅ שליפת חשבונית לפי מזהה טיפול
const getInvoiceByTreatmentId = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ treatmentId: req.params.treatmentId });
    if (!invoice) return res.status(404).json({ message: "חשבונית לא נמצאה" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת חשבונית", error: err.message });
  }
};

// ✅ עדכון חשבונית קיימת לפי מזהה טיפול (כולל סטטוס תשלום)
const updateInvoiceByTreatmentId = async (req, res) => {
  const { treatmentId } = req.params;
  const { items, isPaid } = req.body;

  try {
    // חישובי סכומים
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const VAT_PERCENT = 17;
    const vatAmount = (total * VAT_PERCENT) / 100;
    const totalWithVAT = total + vatAmount;

    // עדכון החשבונית
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { treatmentId },
      {
        items,
        total,
        vatAmount,
        totalWithVAT,
        isPaid: isPaid || false // ✅ עדכון הסטטוס יחד עם החשבונית
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "חשבונית לא נמצאה לעדכון" });
    }

    // ✅ עדכון עלות הטיפול
    await Treatment.findByIdAndUpdate(treatmentId, { cost: Math.round(totalWithVAT) });

    res.json(updatedInvoice);
  } catch (error) {
    console.error("❌ שגיאה בעדכון חשבונית:", error);
    res.status(500).json({ message: "שגיאה בעדכון חשבונית" });
  }
};

// ✅ שליפת כל החשבוניות
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת חשבוניות", error: err.message });
  }
};

// ✅ עדכון סטטוס בלבד (אם תרצה שימוש ייעודי)
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;

    const updated = await Invoice.findByIdAndUpdate(
      id,
      { isPaid },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "חשבונית לא נמצאה" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון סטטוס החשבונית", error: err.message });
  }
};

module.exports = {
  createInvoice,
  getInvoiceByTreatmentId,
  updateInvoiceByTreatmentId,
  getAllInvoices,
  updateInvoiceStatus
};
