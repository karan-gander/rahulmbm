import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO setup
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('join', (roomId) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const numClients = room ? room.size : 0;

      if (numClients === 0) {
        socket.join(roomId);
        socket.emit('created', roomId);
      } else if (numClients === 1) {
        socket.join(roomId);
        socket.emit('joined', roomId);
        io.to(roomId).emit('ready');
      } else {
        socket.emit('full', roomId);
      }
    });

    // Relay SDP offer
    socket.on('offer', (data) => {
      socket.to(data.roomId).emit('offer', data.offer);
    });

    // Relay SDP answer
    socket.on('answer', (data) => {
      socket.to(data.roomId).emit('answer', data.answer);
    });

    // Relay ICE candidates
    socket.on('ice-candidate', (data) => {
      socket.to(data.roomId).emit('ice-candidate', data.candidate);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit('bye');
        }
      });
    });
  });

  // Next.js request handling
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
