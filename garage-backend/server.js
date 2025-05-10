const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ייבוא ראוטים
const customerRoutes = require('./routes/customer.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const treatmentRoutes = require('./routes/treatment.routes');
const repairTypeRoutes = require("./routes/repairtype.routes");
const employeeRoutes = require("./routes/employee.routes");
const authRoutes = require('./routes/auth.routes'); // ייבוא
const carOrderRoutes = require('./routes/carOrder.routes');








// יצירת אפליקציה
const app = express();

// אמצעי עזר
app.use(cors());
app.use(express.json()); // חשוב מאוד!

// חיבור למסד נתונים
mongoose.connect(process.env.MONGO_URI, { })
.then(() => console.log('✅ מחובר ל-MongoDB'))
.catch((error) => console.error('❌ שגיאה בחיבור ל-MongoDB:', error));

// שימוש בנתיבים
app.use('/api/customers', customerRoutes);
app.use('/api/cars', vehicleRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use("/api/repairtypes", repairTypeRoutes);
app.use("/api/employees", employeeRoutes);
app.use('/api/auth', authRoutes); // חיבור
app.use('/api/carorders', carOrderRoutes);








// מסלול ראשי לבדיקה
app.get('/', (req, res) => {
  res.send('🚗 מוסך - API עובד!');
});

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט: ${PORT}`);
});
