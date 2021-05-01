const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let count=0

io.on('connection',(socket)=>{
    console.log('new connection')

    socket.emit('message','Welcome!')
    socket.broadcast.emit('message','new user joined')

    socket.on('sendMessage',(message)=>{
        io.emit('message',message)
    })

    socket.on('disconnect',()=>{
        io.emit('message','user has left')
    })
})

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})