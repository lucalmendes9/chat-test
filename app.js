const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var porta = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req,res) => {
	res.render('index.html');
});

let messages = [];
let users = [];
var count = 0;

io.on('connection', socket => {
	count++;
	console.log(`socket connect: ${socket.id}`);

	socket.emit('previousMessages', messages);

	socket.emit('users', {count: count});
	socket.broadcast.emit('users', {count: count});

	users.push(socket.id);
	socket.emit('listUsers', users);
	socket.broadcast.emit('listUsers', users);

	socket.on('sendMessage', data => {
		messages.push(data);
		socket.broadcast.emit('receivedMessage', data);
	});

	socket.on('disconnect', function() {
		count--;
		socket.emit('users', {count: count});

		users.splice(users.indexOf(socket.id),1);
		socket.emit('listUsers', users);
		socket.broadcast.emit('listUsers', users);

		socket.broadcast.emit('users', {count: count});
	})
});

server.listen(porta);