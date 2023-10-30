const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')

const server = express()

server.use(express.json())
server.use(morgan('dev'))
server.use(cors({
    origin: '*',
    credentials: true,
    methods: 'GET, POST, OPTIONS, PUT, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
}));

const serverIo = http.createServer(server)
const io = new socketio.Server(serverIo)

io.on('connection',(socket) => {
    console.log('Client connected')
    socket.on('message',(body)=>{
        socket.broadcast.emit('message',{
            body,
            from: socket.id
        })
    })
})

const PORT = 4000;

serverIo.listen(PORT, () => {
    console.log(`Socket running on port ${PORT}`);
});

module.exports = server;
