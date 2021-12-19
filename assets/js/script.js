let chatListsDiv = document.getElementById("cems__all__chatlist");
let chatboxChattingDiv = document.getElementById("cems__chatbox__chatting");
let chatlistHeaderText = document.getElementById("cems__chatlist__header__text");
let chatboxMessagesDiv = document.getElementById("cems__chatbox__messages");

let scrollBottom = () => {
  var chatEl = document.getElementById("cems__chatbox__messages");
  chatEl.scrollTop = chatEl.scrollHeight;
};

let chatsOrUsersToggle = (data) => {
  let element = `
    <div class="cems__chat__list" id='${data.uid}' onclick={showMesseges(this.id)}>
    <div class="cems__friend__icon">
      <p>${data.name.charAt(0)}</p>
    </div>
    <div class="cems__chatlist__content">
      <h4 class="cems__chatlist__friendName">${data.name}</h4>
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
  console.log("object");
  let exactData = chatListData.find((data) => data.uid === id);
  console.log(exactData, id);
  if (exactData === undefined) {
    exactData = friendList.find((data) => data.uid === id);
    exactData.messages = [];
  }
  calleeId = exactData.uid;
  calleeName = exactData.name;
  chatboxChattingDiv.innerHTML = chatboxChating(exactData);
  chatbox.gotoChat();
  scrollBottom();
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
let sendMessage = async (id, message = null) => {
  let typeMessage;
  if (message === null) {
    typeMessage = document.getElementById("cems__input__message").value;
  } else {
    typeMessage = message;
  }
  if (typeMessage.length === 0) {
    alert("write something");
  } else {
    document.getElementById("cems__input__message").value = "";
    let exactMessagesData = chatListData.find((d) => d.uid === id);
    if (exactMessagesData === undefined) {
      exactMessagesData = friendList.find((data) => data.uid === id);
      exactMessagesData.messages = [
        {
          messageType: 2,
          text: typeMessage,
          timeStamp: null,
          username: allDetails.userName,
        },
      ];
      chatListData.unshift(exactMessagesData);
      document.getElementById("cems__chatbox__messages").innerHTML = "";
      createMessageOutput(typeMessage);
    } else {
      let withoutExactMessagesData = chatListData.filter((d) => d.uid !== id);
      if (exactMessagesData.messages.length === 0) {
        document.getElementById("cems__chatbox__messages").innerHTML = "";
      }
      exactMessagesData.messages.push({
        messageType: 2,
        text: typeMessage,
        timeStamp: null,
        username: allDetails.userName,
      });
      chatListData = [exactMessagesData, ...withoutExactMessagesData];
      createMessageOutput(typeMessage);
    }
    var chatEl = document.getElementById("cems__chatbox__messages");
    chatEl.scrollTop = chatEl.scrollHeight;
    await agoraFunction.sendPeerMessage(typeMessage, exactMessagesData.uid);
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
      <p>${data.name.charAt(0)}</p>
    </div>
    <div class="cems__chatbox__content--header">
      <h4 class="cems__chatbox__heading--header">${data.name}</h4>
    </div>
  </div>
  <div class="cems__chat__callicon">
  <img src="./images/icons/callIcon.svg" alt="" / onclick=agoraFunction.audioCall()>
  <img src="./images/icons/videocall.svg" alt="" />
  </div>
</div>
<div id="cems__chatbox__messages" class="cems__messageFor${data.uid.replace(/ /g, "_")}">
  ${
    !data.messages.length
      ? `<p class="cems__no_found">No message found</p>`
      : controlSentOrReciveMessage(data)
  }
</div>
<div class="cems__chatbox__footer">
  <img src="./images/icons/attachment.svg" alt="" />
  <input id="cems__input__message" type="text" placeholder="Write a message..." />
  <button class="cems__chatbox__send--footer" onclick=sendMessage('${data.uid}')>Send</button>
</div>
  `;
};

// modal script************************
var modal = document.getElementById("cems__myModal");

// Get the button that opens the modal
var btn = document.getElementById("cems__myBtn");

// Get the <span> element that closes the modal

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "flex";
};
