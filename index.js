require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const userRoute = require('./routes/user.route');
const messagesRoute = require('./routes/messages.route');

const app = express();
const socket = require('socket.io');

app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoute);
app.use('/api/messages', messagesRoute);

const port = process.env.PORT;
const mongo_URI = process.env.MONGO_URI;

const server = http.createServer(app);

mongoose.connect(mongo_URI).then(() => {
  console.log('MongoDB connected');
}).then(() => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

global.onlineUser = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUser.set(userId, socket.id);
  });

  socket.on('send-message', (data) => {
    const sendUserSocket = onlineUser.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('msg-recieve', data.msg);
    }
  });
});