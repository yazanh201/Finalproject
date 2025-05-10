const RepairType = require("../models/RepairType");

const getAllRepairTypes = async (req, res) => {
  try {
    const repairs = await RepairType.find().sort({ repairId: 1 });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בשליפה", error: error.message });
  }
};

const addRepairType = async (req, res) => {
  try {
    const last = await RepairType.findOne().sort({ repairId: -1 });
    const nextId = last ? last.repairId + 1 : 7001;

    const newRepair = new RepairType({
      repairId: nextId,
      name: req.body.name,
      description: req.body.description,
      treatmentId: req.body.treatmentId
    });

    await newRepair.save();
    res.status(201).json(newRepair);
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בהוספה", error: error.message });
  }
};

const getRepairTypeById = async (req, res) => {
  try {
    const repair = await RepairType.findOne({ repairId: req.params.id });
    if (!repair) return res.status(404).json({ message: "סוג טיפול לא נמצא" });
    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה", error: error.message });
  }
};


const updateRepairType = async (req, res) => {
    try {
      const updated = await RepairType.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: '❌ שגיאה בעדכון סוג טיפול', error: error.message });
    }
  };
  
module.exports = {
  getAllRepairTypes,
  addRepairType,
  getRepairTypeById,
  updateRepairType
};
