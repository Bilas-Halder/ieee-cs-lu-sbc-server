const express = require("express");
const router = express.Router();

const { sendMailController } = require("../controllers/utility");

// Post
router.post("/sendMail", sendMailController);

module.exports = router;
