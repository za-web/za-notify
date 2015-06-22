/**
 * index.js
 */

var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express

var http = require('http').Server(app);
var io = require('socket.io')(http);

var mysql = require('mysql');
var db_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'za-notify'
});

db_connection.connect();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname});
});

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        //io.emit('chat message', msg);


        db_connection.query('SELECT * FROM notify', function (err, rows, fields) {
            if (err) throw err;
            rows.forEach(function (item) {
                io.emit('chat message', item.text);
            });
        });
        db_connection.end();

    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

/*
 var app = require('express').createServer();
 var io = require('socket.io')(app);

 app.listen(80);

 app.get('/', function (req, res) {
 res.sendfile(__dirname + '/index.html');
 });

 io.on('connection', function (socket) {
 socket.emit('news', { hello: 'world' });
 socket.on('my other event', function (data) {
 console.log(data);
 });
 });
 */