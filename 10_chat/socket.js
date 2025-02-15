const WebSocket = require("ws");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    // 웹소켓 연결 시
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속", ip);
    ws.on("message", (message) => {
      // 클라이언트로부터 메시지
      console.log(message.toString());
    });
    ws.on("error", (error) => {
      // 에러 시
      console.error(error);
    });
    ws.on("close", () => {
      // 연결 종료 시
      console.log("클라이언트 접속 해제", ip);
      clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => {
      // 3초마다 클라이언트로 메시지 전송
      if (ws.readyState === ws.OPEN) {
        ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
      }
    }, 3000);
  });
};

// const WebSocket = require("ws");

// module.exports = (server) => {
//   // 웹소켓 서버 생성
//   const wss = new WebSocket.Server({ server });

//   // 웹소켓 연결 시 실행
//   wss.on("connection", (ws, req) => {
//     // 클라이언트의 ip 주소 출력
//     const ip = req.headers["x-forwarded-for"] || req.remoteAddress;
//     console.log("새로운 클라이언트 접속", ip);

//     ws.on("message", (message) => {
//       console.log(message.toString());
//     });

//     ws.on("error", (error) => {
//       console.log(error);
//     });

//     ws.on("close", () => {
//       console.log("클라이언트 접속 해제: ", ip);
//       clearInterval(ws.interval); // 웹소켓 연결 해제 시 타이머 해제(그래야 메모리 누수 방지)
//     });

//     ws.interval = setInterval(() => {
//       if (ws.readyState === ws.OPEN) {
//         ws.send("서버에서 클라이언트로 메시지 전송");
//       }
//     }, 3000);

//     // 클라이언트 정보 출력
//     console.log("웹소켓 연결");
//   });
// };
