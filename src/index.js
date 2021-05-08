const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {getUser,getUsersInRoom,addUser,removeUser}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3030
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('new connection')


    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage',(message, callback)=>{
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('profanity is not allowed')
        }
        io.to('a').emit('message',generateMessage(message))
        callback()
    })

    socket.on("sendLocation",({latitude,longitude},callback)=>{
        io.emit("locationMessage",generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        callback('Location delivered')
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left!`))
        }
    })
})

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})