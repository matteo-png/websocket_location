const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let users = [];

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('register', (user) => {
        users.push(user);
        io.emit('update-users', users);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        users = users.filter(u => u.id !== socket.id);
        io.emit('update-users', users);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
