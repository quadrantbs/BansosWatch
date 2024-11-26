const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController.js");
const adminOnly = require("../middlewares/adminOnly.js");
const creatorPrivilage = require("../middlewares/creatorPrivilage.js");

router.post("/", reportController.addReport);

router.get("/", reportController.getAllReport);

router.get("/stats", reportController.getStats);

router.post("/send-mail", adminOnly, reportController.sendMail);

router.get("/:id", reportController.getOneReport);

router.put("/:id", reportController.updateReport);

router.delete("/:id", creatorPrivilage, reportController.deleteReport);

router.patch("/:id/verify", adminOnly, reportController.verifyReport);

router.patch("/:id/reject", adminOnly, reportController.rejectReport);

module.exports = router;
