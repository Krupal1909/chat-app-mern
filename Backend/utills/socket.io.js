const { Server } = require("socket.io");

const userSocketMap = {};
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected to the server", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);

      delete userSocketMap[userId];

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

function getReceivedSocketId(userId) {
  return userSocketMap[userId];
}

module.exports = {
  initSocket,
  getReceivedSocketId,
  io,
};
