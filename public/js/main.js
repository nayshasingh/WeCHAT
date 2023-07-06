const socket=io();
const chatMessages=document.querySelector('.chat-messages');
const chatForm=document.getElementById('chat-form');
const roomName=document.querySelector('#room-name');
const userList=document.querySelector('#users');;
const overlayContainer = document.querySelector('#overlay')
const divblur=document.querySelector('.blur');
const continueButt = document.querySelector('.continue-name');
const nameField = document.querySelector('#name-field');
let username;
// get username and room from URL
const {room}=Qs.parse(location.search,{ignoreQueryPrefix:true});

console.log(username,room);

continueButt.addEventListener('click', () => {
    if (nameField.value == '') return;
    username = nameField.value;
    overlayContainer.style.visibility = 'hidden';
    divblur.style.visibility = 'hidden';
    socket.emit("joinRoom", {username,room});

})
// JOIN Chatroom
// socket.emit('joinRoom',{username,room});

// message from server
socket.on('message',(message,color)=>{
    console.log(message);
    outputMessage(message,color);
    // scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

socket.on('roomUsers',({room,users})=>{
    outputRoomname(room);
    outputUsers(users);
})
// message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // get chat text
    const msg=e.target.elements.chat.value;
    // console.log(msg);

    //emitting a message to the server
    socket.emit('chatMessage',msg);

    e.target.elements.chat.value='';
    e.target.elements.chat.focus();
})

// output message to DOM
function outputMessage(message,color)
{
    const div=document.createElement('div');
    div.classList.add('message',`${color}`);
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
// add roomname to DOM
function outputRoomname(room)
{
    roomName.innerText=room;   
}
function outputUsers(users)
{
    userList.innerHTML=`
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}
function copyText(){
    setTimeout(() => {
        btnText.innerText = "Copy text";
    }, 3000);
    const text = document.getElementById('room-name').innerText
    const btnText = document.getElementById('btn')
    navigator.clipboard.writeText(text);
    btnText.innerText = "Copied"
  }