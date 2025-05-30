
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
      phoneNumber: req.body.phoneNumber,
      treatment: null,
      arrivalStatus: "בהמתנה" // 🔹 ברירת מחדל ברורה
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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const appointments = await Appointment.find({
      date: {
        $gte: startOfMonth.toISOString().slice(0, 10),
        $lte: endOfMonth.toISOString().slice(0, 10),
      }
    }).sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: '❌ שגיאה בשליפת תורים של החודש הנוכחי', error: error.message });
  }
};

// רשימת שעות קבועות
const availableTimes = ["08:00", "10:00", "12:00","14:00","16:00"];

const getAvailableTimes = async (req, res) => {
  try {
    const date = req.params.date;
    const appointments = await Appointment.find({ date }).select("time");
    const takenTimes = appointments.map(a => a.time);
    const freeTimes = availableTimes.filter(time => !takenTimes.includes(time));
    res.json(freeTimes);
  } catch (error) {
    console.error("❌ שגיאה בשליפת שעות פנויות:", error);
    res.status(500).json({ message: "❌ שגיאה בשליפת שעות פנויות" });
  }
};


const confirmArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Appointment.findByIdAndUpdate(id, { arrivalStatus: "הגיע" }, { new: true });
    res.json({ message: "סטטוס עודכן להגעה", appointment: updated });
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בעדכון סטטוס", error: error.message });
  }
};

const rejectArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Appointment.findByIdAndUpdate(id, { arrivalStatus: "לא הגיע" }, { new: true });
    res.json({ message: "סטטוס עודכן לדחייה", appointment: updated });
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בעדכון סטטוס", error: error.message });
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
  getAvailableTimes,
  rejectArrival,
  confirmArrival,
};
