var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  });


socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  
  socket.emit("getId", socket.id);

  socket.on("sendIdClient", ids => {
    socketIo.emit("sendIdServer", ids );
  })

  socket.on("sendWinClient", win => {
    socketIo.emit("sendWinSever", win)
  })

  socket.on("sendDataClient", function(data) {
    socketIo.emit("sendDataServer", { data });
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
});