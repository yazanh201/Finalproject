const express = require("express");
const router = express.Router();
const {
  getAllRepairTypes,
  addRepairType,
  getRepairTypeById,
  updateRepairType
} = require("../controllers/repairtype.controller");

router.get("/", getAllRepairTypes);
router.post("/", addRepairType);
router.get("/:id", getRepairTypeById);
router.put("/:id", updateRepairType);

module.exports = router;
