const express = require("express");
const router = express.Router();

// set up post/get/delete etc. calls

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Private
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;
