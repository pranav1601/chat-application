const socket=io()

const chatForm=document.querySelector('#message-form')
const sendLocation=document.querySelector('#send-location')

socket.on('message',(message)=>{
    console.log(message)
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=e.target.elements.message
    socket.emit('sendMessage',message.value)
})

sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude}=position.coords
        socket.emit("sendLocation",{latitude,longitude})
    })
})