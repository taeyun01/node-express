const express = require("express");
const {
  renderMain,
  renderRoom,
  createRoom,
  enterRoom,
  removeRoom,
} = require("../controllers/index");
const router = express.Router();

router.get("/", renderMain);
router.get("/room", renderRoom);
router.post("/room", createRoom);
router.get("/room/:id", enterRoom);
router.delete("/room/:id/chat", removeRoom);

module.exports = router;
