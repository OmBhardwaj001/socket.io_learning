import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'

const app = express();
const server = createServer(app);

const PORT = 8000;

const io = new Server(server,{
    cors:{
        origin: 'http://localhost:5173',
        methods: ['GET','POST'],
        credentials: true,
    }
});

io.on('connection',(socket)=>{
    console.log("socket connected and id is",socket.id)

    socket.on("message",({room,message})=>{
        console.log({room,message})
        socket.to(room).emit("message-recieved",message);
    })  

    socket.on('join-room',(roomName)=>{
        socket.join(roomName);
        console.log(`${socket.id} joined ${roomName}`)
    })
})


server.listen(PORT,()=>{
   console.log(`server is listening at port no ${PORT}`)    
})
