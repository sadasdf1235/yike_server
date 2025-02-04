const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require("socket.io");
export const socketInit = (app) => {
  const server = createServer(app);
  const io = new Server(server);

  const users = new Map();
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('login', (id) => {
      console.log('a user login');
      socket.name = id;
      users.set(id, socket.id);
    })

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      users.has(socket.name) && users.delete(socket.name);
    })
  });
  
  server.listen(3001, () => {
    console.log('server running at 3001');
  });
}
