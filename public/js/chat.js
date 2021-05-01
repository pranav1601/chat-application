const socket=io()

const chatForm=document.querySelector('#message-form')


// socket.on('countUpdated',(count)=>{
//     console.log('count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicled')
//     socket.emit('increment')
// })

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=e.target.elements.message
    socket.emit('sendMessage',message.value)
})

socket.on('message',(message)=>{
    console.log(message)
})