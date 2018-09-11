const express = require("express");
const router = express.Router();

// set up post/get/delete etc. calls

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
