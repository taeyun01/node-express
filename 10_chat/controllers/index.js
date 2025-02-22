const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

exports.renderMain = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderRoom = async (req, res) => {
  res.render("room", { rooms, title: "GIF 채팅방 생성" });
};

exports.createRoom = async (req, res) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });

    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);

    // 방에 들어가는 부분
    if (req.body.password) {
      // 방에 비밀번호가 있으면 주소에 방 비번 적어줌 (까먹었을 경우를 대비)
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } else {
      res.redirect(`/room/${newRoom._id}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.enterRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    // 방이 존재하는지
    if (!room) {
      return res.redirect("/?error=존재하지 않는 방입니다.");
    }
    // 방에 비밀번호가 있고 입력한 비밀번호가 틀렸으면
    if (room.password && req.body.password !== req.query.password) {
      return res.redirect("/?error=비밀번호가 틀렸습니다.");
    }

    const io = req.app.get("io");
    const { rooms } = io.of("/chat").adapter; // 소켓 갯수

    // rooms.get(req.params.id)?.size = 방에 연결되어있는 소켓 갯수 (즉 방에 들어가있는 참가 유저들)
    if (room.max <= rooms.get(req.params.id)?.size) {
      return res.redirect("/?error=방 인원이 가득 찼습니다.");
    }

    res.render("chat", {
      room,
      title: "GIF 채팅방 생성",
      chats: [],
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.removeRoom = async (req, res) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
