let chatListsDiv = document.getElementById("cems__all__chatlist");
let chatboxChattingDiv = document.getElementById("cems__chatbox__chatting");
let chatlistHeaderText = document.getElementById("cems__chatlist__header__text");
let chatboxMessagesDiv = document.getElementById("cems__chatbox__messages");

let chatsOrUsersToggle = (data) => {
  let element = `
    <div class="cems__chat__list" id='${data.id}' onclick={showMesseges(this.id)}>
    <div class="cems__friend__icon">
      <p>${data.friendName.charAt(0)}</p>
    </div>
    <div class="cems__chatlist__content">
      <h4 class="cems__chatlist__friendName">${data.friendName}</h4>
    </div>
  </div>
    `;
  return (chatListsDiv.innerHTML += element);
};
let gotoChatList = () => {
  chatListsDiv.innerHTML = "";
  chatlistHeaderText.innerText = "Chats";
  if (chatListData.length < 1) {
    chatListsDiv.innerHTML = `<p class="cems__no_found">No Chats found</p>`;
  } else {
    chatListData.map((data) => {
      chatsOrUsersToggle(data);
    });
  }
};
gotoChatList();
let gotoUsers = () => {
  chatListsDiv.innerHTML = "";
  chatlistHeaderText.innerText = "Users";
  if (friendList.length < 1) {
    chatListsDiv.innerHTML = `<p class="cems__no_found">No Friend found</p>`;
  } else {
    friendList.map((data) => {
      chatsOrUsersToggle(data);
    });
  }
};
function showMesseges(id) {
  let exactData = chatListData.find((data) => data.id === id);
  if (exactData === undefined) {
    exactData = friendList.find((data) => data.id === id);
    exactData.messages = [];
  }
  calleeId=exactData.friendName
  chatboxChattingDiv.innerHTML = chatboxChating(exactData);
  chatbox.gotoChat();
}

let backToChatList = () => {
  gotoChatList();
  chatbox.backTochatList();
};

let controlSentOrReciveMessage = (data) => {
  let chatboxMessages = document.createElement("ul");

  chatboxMessages.innerHTML = "";

  data.messages.map((m) => {
    if (m.messageType === 2) {
      chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--operator">${m.text}</div>`;
    } else {
      chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--visitor">${m.text}</div>`;
    }
  });
  return chatboxMessages.innerHTML;
};

let createMessageOutput = (message) => {
  let createMessageOutput = document.createElement("div");
  createMessageOutput.className = "cems__messages__item cems__messages__item--operator";
  createMessageOutput.innerHTML = `${message}`;
  document.getElementById("cems__chatbox__messages").appendChild(createMessageOutput);
};
let sendMessage = async (id) => {
  let typeMessage = document.getElementById("cems__input__message").value;
  if (typeMessage.length === 0) {
    alert("write something");
  } else {
    document.getElementById("cems__input__message").value = "";
    let exactMessagesData = chatListData.find((d) => d.id === id);
    if (exactMessagesData === undefined) {
      exactMessagesData = friendList.find((data) => data.id === id);
      exactMessagesData.messages = [
        {
          messageType: 2,
          text: typeMessage,
          timeStamp: null,
          username: "shozonraj",
        },
      ];
      chatListData.unshift(exactMessagesData);
      document.getElementById("cems__chatbox__messages").innerHTML = "";
      createMessageOutput(typeMessage);
    } else {
      let withoutExactMessagesData = chatListData.filter((d) => d.id !== id);
      if (exactMessagesData.messages.length === 0) {
        document.getElementById("cems__chatbox__messages").innerHTML = "";
      }
      exactMessagesData.messages.push({
        messageType: 2,
        text: typeMessage,
        timeStamp: null,
        username: "shozonraj",
      });
      chatListData = [exactMessagesData, ...withoutExactMessagesData];
      createMessageOutput(typeMessage);
    }
    await agoraFunction.sendPeerMessage(typeMessage, exactMessagesData.friendName);
  }
};

let chatboxChating = (data) => {
  return `
  <div class="cems__chatbox__header">
    <div class="cems__chat__details">
    <div id="cems__chatbox_backButton--header" onclick=backToChatList()>
    <img src="./images/icons/backArrow.svg" alt="" />
    </div>
    <div class="cems__friend__icon">
      <p>${data.friendName.charAt(0)}</p>
    </div>
    <div class="cems__chatbox__content--header">
      <h4 class="cems__chatbox__heading--header">${data.friendName}</h4>
    </div>
  </div>
  <div class="cems__chat__callicon">
  <img src="./images/icons/callIcon.svg" alt="" / onclick=audioCall()>
  <img src="./images/icons/videocall.svg" alt="" />
  </div>
</div>
<div id="cems__chatbox__messages" class="messageFor${data.friendName.replace(/ /g, "_")}">
  ${
    !data.messages.length
      ? `<p class="cems__no_found">No message found</p>`
      : controlSentOrReciveMessage(data)
  }
</div>
<div class="cems__chatbox__footer">
  <img src="./images/icons/attachment.svg" alt="" />
  <input id="cems__input__message" type="text" placeholder="Write a message..." />
  <button class="cems__chatbox__send--footer" onclick=sendMessage('${data.id}')>Send</button>
</div>
  `;
};


// modal script************************
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
