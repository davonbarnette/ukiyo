const express = require('express');
const cors = require('cors');
const http = require('http');
const io = require('socket.io');
const WebSocketClass = require("./websocket");

let app = express();

app.use(cors({
    origin:["*"]
}))
app.get('/', (req, res)=> res.json({success:"success"}))

const server = http.createServer(app);

let websocket = new WebSocketClass(io(server, {cors: { origin: "*" }}));

let port = process.env.PORT || 8000;
server.listen(port, ()=>{
    console.log('Server started on port: ', port);
})