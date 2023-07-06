const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const Sentiment = require('sentiment');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users')
const {message_sentiment}=require('./utils/sentiment');

const app=express();
const server=http.createServer(app);
const io=socketio(server);
const sentiment = new Sentiment();

  
// set static folder
app.use(express.static(path.join(__dirname,'public')));

// run when the client connects
io.on('connection',(socket)=>{
    socket.on('joinRoom',({username,room})=>{

        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        console.log('new connection');

        socket.emit('message',formatMessage('Bot','Welcome to WeChat'),'yellow'); // just emits to single user
        
        // broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',formatMessage('Bot',`${user.username} has joined the chat`),'yellow');

        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })

    //******** to emit to everyone io.emit()********
    
    // listen for chat message
    socket.on('chatMessage',(msg)=>{
        // console.log(msg);
        const user=getCurrentUser(socket.id)
        console.log(user);
        // const sentiment = new Sentiment();
        const result = sentiment.analyze(msg);
        const score=result.score;
        const color=message_sentiment(score);
        io.to(user.room).emit('message',formatMessage(`${user.username}`,msg),color);
    })
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user)
        {
            io.to(user.room).emit('message',formatMessage('Bot',`${user.username} has left the chat`),'yellow');

            // send users and room info
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
    })
})
const PORT= 3000|| process.env.PORT;
server.listen(PORT,()=>{
    console.log("server running on port 3000")
})


