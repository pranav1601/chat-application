const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3030
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('new connection')

    socket.emit('message','Welcome!')
    socket.broadcast.emit('message','new user joined')

    socket.on('sendMessage',(message, callback)=>{
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('profanity is not allowed')
        }
        io.emit('message',message)
        callback()
    })

    socket.on("sendLocation",({latitude,longitude},callback)=>{
        io.emit("locationMessage",`https://google.com/maps?q=${latitude},${longitude}`)
        callback('Location delivered')
    })

    socket.on('disconnect',()=>{
        io.emit('message','user has left')
    })
})

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})