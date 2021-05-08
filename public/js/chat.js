const socket=io()

const chatForm=document.querySelector('#message-form')
const chatFormInput=chatForm.querySelector('input')
const chatFormButton=chatForm.querySelector('button')

const sendLocation=document.querySelector('#send-location')
const messages=document.querySelector("#messages")

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML

socket.on('message',(message)=>{
    // console.log(message)
    const html=Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(location)=>{
    // console.log(location)
    const html=Mustache.render(locationTemplate,{
        location:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    chatFormButton.setAttribute('disabled','disabled')

    const message=e.target.elements.message
    socket.emit('sendMessage',message.value,(error)=>{
        chatFormButton.removeAttribute('disabled')
        chatFormInput.value=''
        chatFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message delivered')
    })
})

sendLocation.addEventListener('click',()=>{
    
    
    if(!navigator.geolocation){
        return alert('geolocation not supported by your browser')
    }
    sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude}=position.coords
        socket.emit("sendLocation",{latitude,longitude},(error)=>{
            sendLocation.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            console.log("Location delivered")
        })
    })
})