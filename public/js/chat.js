const socket=io()

socket.on('countUpdated',(count)=>{
    console.log('count has been updated', count)
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log('clicled')
    socket.emit('increment')
})