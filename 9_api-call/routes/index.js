const express = require("express");
const { getMyPosts, searchByHashtag } = require("../controllers");
const router = express.Router();
// const { test } = require("../controllers");

// router.get("/test", test);
router.get("/myposts", getMyPosts);
router.get("/search/:hashtag", searchByHashtag);

module.exports = router;
