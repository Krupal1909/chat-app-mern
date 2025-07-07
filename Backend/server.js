const app = require("./app");
const cloudinary = require("cloudinary").v2;
const http = require('http');
const { initSocket } = require("./utills/socket.io");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);
initSocket(server)

server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});

module.exports = app;