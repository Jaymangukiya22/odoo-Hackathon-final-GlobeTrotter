const express = require("express");
const router = express.Router();
const stopController = require("../controllers/stopController");

router.post("/", stopController.createStop);
router.get("/", stopController.getAllStops);
router.get("/:id", stopController.getStopById);
router.put("/:id", stopController.updateStop);
router.delete("/:id", stopController.deleteStop);

module.exports = router;
