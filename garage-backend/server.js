const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ייבוא ראוטים
const customerRoutes = require('./routes/customer.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const treatmentRoutes = require('./routes/treatment.routes');
const repairTypeRoutes = require("./routes/repairtype.routes");
const employeeRoutes = require("./routes/employee.routes");
const authRoutes = require('./routes/auth.routes');
const carOrderRoutes = require('./routes/carOrder.routes');

// יצירת אפליקציה
const app = express();

// אמצעי עזר
app.use(cors());
app.use(express.json());

// 🖼️ שירות קבצים סטטיים מתוך uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// חיבור למסד נתונים
require("dotenv").config(); // בראש הקובץ

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// שימוש בנתיבים
app.use('/api/customers', customerRoutes);
app.use('/api/cars', vehicleRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use("/api/repairtypes", repairTypeRoutes);
app.use("/api/employees", employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carorders', carOrderRoutes);


// מסלול ראשי לבדיקה
app.get('/', (req, res) => {
  res.send('🚗 מוסך - API עובד!');
});

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 השרת רץ על פורט: ${PORT}`);
});
