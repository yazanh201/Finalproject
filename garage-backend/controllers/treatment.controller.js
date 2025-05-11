const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');
const RepairType = require('../models/RepairType');

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

// הוספת טיפול
const addTreatment = async (req, res) => {
  try {
    const last = await Treatment.findOne().sort({ treatmentNumber: -1 });
    const nextNumber = last ? last.treatmentNumber + 1 : 6001;
    const treatmentId = nextNumber.toString();

    const treatment = new Treatment({
      ...req.body,
      treatmentNumber: nextNumber,
      treatmentId: treatmentId,
    });

    await treatment.save();
    res.status(201).json({ message: "✅ הטיפול נשמר", treatment });
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בהוספת טיפול", error: err.message });
  }
};

// עדכון טיפול
const updateTreatment = async (req, res) => {
  try {
    const updated = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "❌ שגיאה בעדכון טיפול", error: err.message });
  }
};


const confirmArrivalAndAddTreatment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // שלב 1: שליפת התור
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "❌ תור לא נמצא" });

    // שלב 2: יצירת מספר רץ חדש לטיפול
    const lastTreatment = await Treatment.findOne().sort({ treatmentNumber: -1 });
    const nextTreatmentNumber = lastTreatment ? lastTreatment.treatmentNumber + 1 : 6001;

    // שלב 3: יצירת טיפול חדש עם כל השדות החדשים
    const treatment = new Treatment({
      treatmentNumber: nextTreatmentNumber,
      treatmentId: nextTreatmentNumber.toString(),
      appointmentNumber: appointment.appointmentNumber,
      date: appointment.date,
      carPlate: appointment.carNumber,
      customerName: appointment.name,
      description: appointment.description || "",
      treatmentType: "",     // ניתן לעדכן ידנית לאחר מכן
      workerName: "",        // שם העובד - ניתן לעדכן בהמשך
      images: [],            // ברירת מחדל – ללא תמונות
      cost: 0,               // ברירת מחדל – 0 עד לעדכון
      repairTypeId: null     // נעדכן לאחר יצירת RepairType
    });

    await treatment.save();

    // שלב 4: יצירת RepairType חדש וקישור לטיפול
    const lastRepairType = await RepairType.findOne().sort({ repairId: -1 });
    const nextRepairId = lastRepairType ? lastRepairType.repairId + 1 : 7001;

    const repairType = new RepairType({
      repairId: nextRepairId,
      name: "",
      description: "",
      treatmentId: treatment.treatmentNumber
    });

    await repairType.save();

    // שלב 5: עדכון טיפול עם repairTypeId
    treatment.repairTypeId = nextRepairId;
    await treatment.save();

    // שלב 6: עדכון התור עם מזהה הטיפול
    appointment.treatment = treatment._id;
    await appointment.save();

    // תגובה סופית
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

const getTreatmentByObjectId = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'טיפול לא נמצא' });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפה לפי מזהה', error: err.message });
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
};
