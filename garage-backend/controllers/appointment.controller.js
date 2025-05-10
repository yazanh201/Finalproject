
// הוספת תור
const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');

const addAppointment = async (req, res) => {
  try {
    // 🔢 קביעת מזהה תור חדש
    const lastAppointment = await Appointment.findOne().sort({ appointmentNumber: -1 });
    const nextAppointmentNumber = lastAppointment ? lastAppointment.appointmentNumber + 1 : 5001;

    // ✅ יצירת תור חדש בלבד (בלי טיפול כרגע)
    const appointment = new Appointment({
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,
      idNumber: req.body.idNumber,
      name: req.body.name,
      carNumber: req.body.carNumber,
      appointmentNumber: nextAppointmentNumber,
      treatment: null // 🛑 אין טיפול עדיין – יתווסף לאחר אישור הגעה
    });

    await appointment.save();

    res.status(201).json({ message: "✅ תור נשמר בהצלחה", appointment });
  } catch (error) {
    console.error("❌ שגיאה ביצירת תור:", error);
    res.status(500).json({ message: "❌ שגיאה בשמירת תור", error: error.message });
  }
};

// שליפת כל התורים
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('treatment') // מצרף את הטיפול לפי הקישור
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: '❌ שגיאה בשליפת תורים', error: error.message });
  }
};


// חיפוש לפי ת"ז
const getByIdNumber = async (req, res) => {
  try {
    const appointments = await Appointment.find({ idNumber: req.params.idNumber });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: '❌ שגיאה בחיפוש לפי ת"ז', error: error.message });
  }
};

// חיפוש לפי תאריך
const getByDate = async (req, res) => {
  try {
    const appointments = await Appointment.find({ date: req.params.date });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: '❌ שגיאה בחיפוש לפי תאריך', error: error.message });
  }
};


const getByCarNumber = async (req, res) => {
    try {
      const appointments = await Appointment.find({ carNumber: req.params.carNumber });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: '❌ שגיאה בחיפוש לפי מספר רכב', error: error.message });
    }
  };
  

// עדכון תור
const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: '❌ שגיאה בעדכון תור', error: error.message });
  }
};

const getByIdOrCar = async (req, res) => {
    try {
      const search = req.params.term;
      const results = await Appointment.find({
        $or: [
          { idNumber: search },
          { carNumber: search }
        ]
      });
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "❌ שגיאה בחיפוש", error: error.message });
    }
  };


  // שליפה לפי appointmentNumber
const getAppointmentByNumber = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ appointmentNumber: req.params.appointmentNumber }).populate("treatment");
    if (!appointment) {
      return res.status(404).json({ message: "תור לא נמצא" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בשליפת תור לפי מזהה", error: error.message });
  }
};

// שליפת תורים של החודש האחרון
const getAppointmentsThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    const appointments = await Appointment.find({
      date: { $gte: monthAgo, $lte: now }
    }).sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: '❌ שגיאה בשליפת תורים לחודש', error: error.message });
  }
};



module.exports = {
  addAppointment,
  getAppointments,
  getByIdNumber,
  getByDate,
  updateAppointment,
  getByCarNumber,
  getByIdOrCar,
  getAppointmentByNumber,
  getAppointmentsThisMonth,
};
