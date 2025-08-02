const CarOrder = require('../models/CarOrder');

// יצירת הזמנה חדשה
const createCarOrder = async (req, res) => {
  try {
    const newOrder = new CarOrder(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'הזמנה נוספה בהצלחה', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה ביצירת הזמנה', error: error.message });
  }
};

// שליפת כל ההזמנות
const getAllCarOrders = async (req, res) => {
  try {
    const orders = await CarOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשליפת הזמנות', error: error.message });
  }
};

// עדכון הזמנה
const updateCarOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CarOrder.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'הזמנה עודכנה', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון הזמנה', error: error.message });
  }
};

// חיפוש לפי מספר רכב
const searchCarOrdersByCarNumber = async (req, res) => {
  try {
    const { carNumber } = req.params;
    const orders = await CarOrder.find({ carNumber });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בחיפוש הזמנות', error: error.message });
  }
};

// 📌 מחיקת הזמנה לפי ID
const deleteCarOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await CarOrder.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "❌ ההזמנה לא נמצאה למחיקה" });
    }

    res.status(200).json({ message: "✅ ההזמנה נמחקה בהצלחה" });
  } catch (error) {
    console.error("❌ שגיאה במחיקת הזמנה:", error.message);
    res.status(500).json({ message: "❌ שגיאה בשרת", error: error.message });
  }
};

const getActiveOrdersByCarNumber = async (req, res) => {
  try {
    const { carNumber } = req.params;
    const activeOrders = await CarOrder.find({
      carNumber,
      status: { $nin: ['בוטלה', 'הושלמה'] } // ✅ לא בוטלה ולא הושלמה
    });
    res.json(activeOrders);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשליפת הזמנות פעילות', error: error.message });
  }
};

// שליפת הזמנות לפי חודש נוכחי
const getMonthlyCarOrders = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const orders = await CarOrder.find({
      orderDate: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "שגיאה בשליפת הזמנות חודשיות", error: error.message });
  }
};


module.exports = {
  createCarOrder,
  getAllCarOrders,
  updateCarOrder,
  searchCarOrdersByCarNumber,
  deleteCarOrder,
  getActiveOrdersByCarNumber ,
  getMonthlyCarOrders
};
