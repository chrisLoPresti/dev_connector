const express = require("express");
const router = express.Router();

// set up post/get/delete etc. calls

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

module.exports = router;
