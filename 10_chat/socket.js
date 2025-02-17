const SocketIO = require("socket.io");

module.exports = (server) => {
  const io = SocketIO(server, { path: "/socket.io" }); // 클라이언트와 연결을 맺을 때 사용하는 경로 (path까지 붙혀야 서버로 연결이됨)

  io.on("connection", (socket) => {
    // 웹소켓 연결 시
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속!", ip, socket.id, req.ip);
    socket.on("disconnect", () => {
      // 연결 종료 시
      console.log("클라이언트 접속 해제", ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on("error", (error) => {
      // 에러 시
      console.error(error);
    });
    socket.on("reply", (data) => {
      // 클라이언트로부터 보낸 메시지
      console.log(data);
    });
    socket.interval = setInterval(() => {
      // 3초마다 클라이언트로 메시지 전송
      socket.emit("news", "Hello Socket.IO"); // news라는 이벤트로 메시지 전송 (브라우저에서는 socket.on("news", (data) => { console.log(data); }) 이렇게 받음)
    }, 3000);
  });
};
