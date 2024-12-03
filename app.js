const express = require('express')
const http = require('http')
const path = require('path')


const {Server} = require('socket.io')

const app = express()
const port = 3000
const server = http.createServer(app)
const io = new Server(server)


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))

io.on('connection',(socket)=>{

    socket.on("send-location", function(data){
        io.emit("receive-locaiton",{
            id:socket.id,
            ...data
        })
        console.log("user Connected : ",socket.id ,"Location : ",data);  
    })

    socket.on('disconnet',function(){
        io.emit('user-disconnect',socket.id)
        
    })
    
})

app.get('/',(req,res)=>{
    
    res.render('index.ejs')
})

app.get('/CONTACT',(req,res)=>{
    res.render('contact.ejs')
})
app.get('/ABOUT',(req,res)=>{
    res.render('about.ejs')
})



server.listen(port,()=>{
    console.log(`App is running on http://localhost:${port}/`)
})