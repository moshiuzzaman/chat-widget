
let chatListsDiv = document.getElementById("all__chatlist");
let chatboxChattingDiv = document.getElementById("chatbox__chatting");
let chatlistHeaderText=document.getElementById('chatlist__header__text')
let chatboxMessagesDiv=document.getElementById('chatbox__messages')

let chatsOrUsersToggle=(data)=>{
  let element = `
    <div class="chat__list" id='${data.id}' onclick={showMesseges(this.id)}>
    <div class="friend__icon">
      <p>${data.friendName.charAt(0)}</p>
    </div>
    <div class="chatlist__content">
      <h4 class="chatlist__friendName">${data.friendName}</h4>
    </div>
  </div>
    `;
    return (chatListsDiv.innerHTML += element);
}
let gotoChatList =  () =>{
  chatListsDiv.innerHTML = "";
  chatlistHeaderText.innerText='Chats'
  chatListData.map((data) => {
    chatsOrUsersToggle(data)
  });
};
gotoChatList()
let gotoUsers=()=>{
  chatListsDiv.innerHTML = "";
  chatlistHeaderText.innerText='Users'
  friendList.map((data) => {
    chatsOrUsersToggle(data)
  });
}
function showMesseges(id) {
  let exactData = chatListData.find((data) => data.id === id);
  if(exactData===undefined){
    exactData = friendList.find((data) => data.id === id);
    exactData.messages=[]
  }
  console.log(exactData)
  chatboxChattingDiv.innerHTML = chatboxChating(exactData);
  chatbox.gotoChat();
}

let backToChatList = () => {
  gotoChatList();
  chatbox.backTochatList();
};

let controlSentOrReciveMessage = (data) => {
  let chatboxMessages = document.createElement('ul');
  
  chatboxMessages.innerHTML = "";
  data.messages.map((m) => {
    if (m.messageType === 2) {
      chatboxMessages.innerHTML += `<div class="messages__item messages__item--operator"><xmp>${m.text}</xmp></div>`;
    } else {
      chatboxMessages.innerHTML += `<div class="messages__item messages__item--visitor"><code><xmp>${m.text}</xmp></code> </div>`;
    }
  });
  console.log('chatboxMessages'+ chatboxMessages)
  return chatboxMessages.innerHTML
};


let createMessageOutput=(message)=>{
  let createMessageOutput=document.createElement('div')
  createMessageOutput.className="messages__item messages__item--operator"
  createMessageOutput.innerHTML=`<xmp>${message}</xmp>`
  document.getElementById('chatbox__messages').appendChild(createMessageOutput)
}
let sendMessage=(id)=>{
  let typeMessage=document.getElementById('input__message').value
  if(typeMessage.length===0){
    alert('write something')
  }else{
    document.getElementById('input__message').value=''
    let exactMessagesData = chatListData.find((d) => d.id === id);
    if(exactMessagesData===undefined){
      exactMessagesData = friendList.find((data) => data.id === id);
      exactMessagesData.messages=[{
          messageType: 2,
          text: typeMessage,
          timeStamp: null,
          username: "shozonraj",
      }]
      chatListData.push(exactMessagesData)
      console.log(chatListData)
      document.getElementById('chatbox__messages').innerHTML=''
      createMessageOutput(typeMessage)
    }else{
      let withoutExactMessagesData=chatListData.filter((d) => d.id !== id);
      if(exactMessagesData.messages.length===0){
        document.getElementById('chatbox__messages').innerHTML=''
      }
      exactMessagesData.messages.push({
          messageType: 2,
          text: typeMessage,
          timeStamp: null,
          username: "shozonraj",
      })
      chatListData=[exactMessagesData,...withoutExactMessagesData ]
      createMessageOutput(typeMessage)
    }
  }
 
}

let chatboxChating = (data) => {
  return `
  <div class="chatbox__header">
  <div id="chatbox_backButton--header" onclick=backToChatList()>
    <img src="./images/icons/backArrow.svg" alt="" />
  </div>
  <div class="friend__icon">
    <p>${data.friendName.charAt(0)}</p>
  </div>
  <div class="chatbox__content--header">
    <h4 class="chatbox__heading--header">${data.friendName}</h4>
  </div>
</div>
<div id="chatbox__messages">
  ${!data.messages.length ? `<p>No message found</p>` : controlSentOrReciveMessage(data)}
</div>
<div class="chatbox__footer">
  <img src="./images/icons/attachment.svg" alt="" />
  <input id="input__message" type="text" placeholder="Write a message..." />
  <button class="chatbox__send--footer" onclick=sendMessage('${data.id}')>Send</button>
</div>
  `;
};
