const express = require("express");
const inquiryController = require("../controller/inquiryController");
const { auth, requireTenant } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, inquiryController.getInquiries);
router.post("/", auth, requireTenant, inquiryController.createInquiry);
router.post("/:id/reply", auth, inquiryController.replyToInquiry);
router.put("/:id", auth, inquiryController.updateInquiry);

module.exports = router;
