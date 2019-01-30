const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/registerUser.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html'); 
});

app.get('/users', (req, res) => {
    res.sendFile(__dirname + '/public/usersList.html');
});

let users = {};

io.on("connection", socket => {
    console.log('a user connected');
    let currentUser = null;
    socket.on('user', (username) => {
        users[username] = socket.id;
        currentUser = username;
        // socket.emit('getUsers', users);
        io.emit('getUsers', users); //IO per me qu te tonat
        console.log(users);
    });

    socket.on('chat message', (data) => {
        //console.log('message: ' + msg);
        // io.emit('chat message', msg);
        console.log(data.receiver + " - " + data.msg);
        io.to(users[data.receiver]).emit('chat message', data.msg);
    });

    socket.on('disconnect', () => {
        delete users[currentUser];
        console.log('user disconnected ' + currentUser);
    });
});

http.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});