const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');
const RepairType = require('../models/RepairType');
const Client = require('../models/Customer');

// שליפה כללית
const getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find().sort({ createdAt: -1 });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפת טיפולים', error: err.message });
  }
};

// שליפה לפי מזהה טיפול
const getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findOne({ treatmentNumber: parseInt(req.params.treatmentId) });
    if (!treatment) return res.status(404).json({ message: 'טיפול לא נמצא' });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה לפי מזהה טיפול', error: err.message });
  }
};

// שליפה לפי מזהה תור
const getTreatmentsByAppointmentNumber = async (req, res) => {
  try {
    const treatments = await Treatment.find({ appointmentNumber: req.params.appointmentNumber });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה לפי מזהה תור', error: err.message });
  }
};

// שליפה לפי תאריך
const getTreatmentsByDate = async (req, res) => {
  try {
    const treatments = await Treatment.find({ date: req.params.date });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה לפי תאריך', error: err.message });
  }
};

// שליפה לפי מספר רכב
const getTreatmentsByCarPlate = async (req, res) => {
  try {
    const treatments = await Treatment.find({ carPlate: req.params.carPlate });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה לפי רכב', error: err.message });
  }
};

// הוספת טיפול חדש
// הוספת טיפול חדש
const addTreatment = async (req, res) => {
  try {
    const last = await Treatment.findOne().sort({ treatmentNumber: -1 });
    const nextNumber = last ? last.treatmentNumber + 1 : 6001;
    const treatmentId = nextNumber.toString();

    const invoiceFile = req.files?.invoice?.[0]?.filename || '';
    const images = req.files?.images?.map(f => f.filename) || [];

    let {
      date,
      cost,
      carPlate,
      description,
      workerName,
      customerName,
      repairTypeId,
      status,
      treatmentServices // ✅ נוספה שורה זו
    } = req.body;

    // ✅ עיבוד treatmentServices אם הוא מחרוזת (כמו שמתקבל מ־FormData)
    if (treatmentServices && typeof treatmentServices === 'string') {
      try {
        treatmentServices = JSON.parse(treatmentServices);
      } catch (err) {
        return res.status(400).json({ message: "פורמט לא תקין של treatmentServices", error: err.message });
      }
    }

    const treatment = new Treatment({
      treatmentNumber: nextNumber,
      treatmentId,
      date,
      cost: isNaN(Number(cost)) ? 0 : Number(cost),
      carPlate,
      invoiceFile,
      description,
      workerName,
      customerName,
      images,
      repairTypeId: isNaN(Number(repairTypeId)) ? null : Number(repairTypeId),
      status,
      treatmentServices // ✅ שמירה במסד הנתונים
    });

    await treatment.save();
    res.status(201).json({ message: "✅ הטיפול נשמר", treatment });
  } catch (err) {
    console.error("❌ שגיאה בשמירת טיפול:", err);
    res.status(500).json({ message: "❌ שגיאה בהוספת טיפול", error: err.message });
  }
};

// עדכון טיפול
const updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ message: "טיפול לא נמצא" });

    treatment.date = req.body?.date || treatment.date;
    treatment.cost = isNaN(Number(req.body?.cost)) ? treatment.cost : Number(req.body.cost);
    treatment.carPlate = req.body?.carPlate || treatment.carPlate;
    treatment.description = req.body?.description || treatment.description;
    treatment.workerName = req.body?.workerName || treatment.workerName;
    treatment.customerName = req.body?.customerName || treatment.customerName;
    treatment.status = req.body?.status || treatment.status;
    treatment.repairTypeId = req.body?.repairTypeId || treatment.repairTypeId;
    treatment.workerId = req.body?.workerId || treatment.workerId;
    treatment.idNumber = req.body?.idNumber || treatment.idNumber;

    if (req.files?.invoice?.[0]) {
      treatment.invoiceFile = req.files.invoice[0].filename;
    }
    if (req.files?.images?.length) {
      treatment.images = req.files.images.map(file => file.filename);
    }

    await treatment.save();
    res.json({ message: "✅ הטיפול עודכן בהצלחה", treatment });
  } catch (err) {
    console.error("❌ שגיאה בעדכון טיפול:", err);
    res.status(500).json({ message: "❌ שגיאה בעדכון טיפול", error: err.message });
  }
};

// אישור הגעה ויצירת טיפול מתור
const confirmArrivalAndAddTreatment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "❌ תור לא נמצא" });

    const lastTreatment = await Treatment.findOne().sort({ treatmentNumber: -1 });
    const nextTreatmentNumber = lastTreatment ? lastTreatment.treatmentNumber + 1 : 6001;

    const treatment = new Treatment({
      treatmentNumber: nextTreatmentNumber,
      treatmentId: nextTreatmentNumber.toString(),
      appointmentNumber: appointment.appointmentNumber,
      date: appointment.date,
      carPlate: appointment.carNumber,
      customerName: appointment.name,
      description: appointment.description || "",
      treatmentType: "",
      workerName: "",
      images: [],
      cost: 0,
      repairTypeId: null,
      status: 'בטיפול'
    });

    await treatment.save();

    const lastRepairType = await RepairType.findOne().sort({ repairId: -1 });
    const nextRepairId = lastRepairType ? lastRepairType.repairId + 1 : 7001;

    const repairType = new RepairType({
      repairId: nextRepairId,
      name: "",
      description: "",
      treatmentId: treatment.treatmentNumber
    });

    await repairType.save();

    treatment.repairTypeId = nextRepairId;
    await treatment.save();

    appointment.treatment = treatment._id;
    await appointment.save();

    res.status(201).json({
      message: "✅ טיפול וסוג טיפול נוצרו בהצלחה",
      treatment,
      repairType
    });
  } catch (err) {
    console.error("❌ שגיאה ביצירת טיפול וסוג טיפול:", err);
    res.status(500).json({
      message: "❌ שגיאה ביצירת טיפול וסוג טיפול",
      error: err.message
    });
  }
};

// שליפה לפי אובייקט ID
const getTreatmentByObjectId = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'טיפול לא נמצא' });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה לפי מזהה', error: err.message });
  }
};

// בדיקה לפי מספר רכב
const checkTreatmentByPlate = async (req, res) => {
  const { plate } = req.query;
  if (!plate) return res.status(400).json({ message: 'חובה לציין plate' });

  try {
    const cleanedPlate = plate.replace(/[^\d]/g, "");

    const treatment = await Treatment.findOne({ carPlate: cleanedPlate });

    if (!treatment) {
      console.log("🚫 טיפול לא נמצא עם לוחית:", cleanedPlate);
      return res.json({ exists: false });
    }

    const client = await Client.findOne({
      vehicles: { $in: [cleanedPlate] }
    });

    if (!client) {
      console.log("🚫 לקוח לא נמצא עם מספר רכב:", cleanedPlate);
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      treatmentId: treatment._id,
      customerName: client.name,
      idNumber: client.idNumber,
      workerName: treatment.workerName || ''
    });

  } catch (err) {
    console.error("❌ שגיאה בבדיקת טיפול לפי לוחית:", err);
    res.status(500).json({ message: "שגיאה פנימית", error: err.message });
  }
};

module.exports = {
  getAllTreatments,
  getTreatmentById,
  getTreatmentsByAppointmentNumber,
  getTreatmentsByDate,
  getTreatmentsByCarPlate,
  addTreatment,
  updateTreatment,
  confirmArrivalAndAddTreatment,
  getTreatmentByObjectId,
  checkTreatmentByPlate
};
