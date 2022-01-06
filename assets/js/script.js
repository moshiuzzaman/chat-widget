let chatListsDiv = document.getElementById("cems__all__chatlist");
let chatboxChattingDiv = document.getElementById("cems__chatbox__chatting");
let chatlistHeaderText = document.getElementById("cems__chatlist__header__text");
let chatboxMessagesDiv = document.getElementById("cems__chatbox__messages");

let scrollBottom = () => {
  var chatEl = document.getElementById("cems__chatbox__messages");
  chatEl.scrollTop = chatEl.scrollHeight;
};
let usersToggle = (data) => {
  let element = `
    <div class="cems__chat__list" id='${data.id}' onclick={showMesseges(this.id)}>
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
let chatsToggle = (data) => {
  let lastMessageDetails = data.messages.pop();

  let lastMessage = "";
  if (lastMessageDetails != undefined) {
    data.messages.push(lastMessageDetails);
    if (lastMessageDetails.messageType == 2) {
      if (lastMessageDetails.text.substring(0, 27) === "FiLe-https://tradazine.com/") {
        lastMessage = `You : Send a file`;
      }else{
        lastMessage = `You : ${lastMessageDetails.text}`;
      }
    } else {
      if (lastMessageDetails.text.substring(0, 27) === "FiLe-https://tradazine.com/") {
        lastMessage = ` Send a file`;
      }else{
      lastMessage = lastMessageDetails.text;
    }}
  }

  let isUnread = unreadMessageId.find((id) => id == data.id);
  console.log(isUnread);
  let setclass = "";
  if (isUnread != undefined) {
    setclass = "unseen__message";
  }
  let element = `
    <div class="cems__chat__list ${setclass}" id='${data.id}' onclick={showMesseges(this.id)}>
    <div class="cems__friend__icon">
      <p>${data.name.toUpperCase().charAt(0)}</p>
    </div>
    <div class="cems__chatlist__content">
      <h4 class="cems__chatlist__friendName">${data.name}</h4>
      <p> ${lastMessage}</p>
    </div>
  </div>
    `;
  return (chatListsDiv.innerHTML += element);
};
let gotoChatList = () => {
  let className = calleeId;
  chatListsDiv.innerHTML = "";
  chatlistHeaderText.innerText = "Chats";
  if (chatListData.length < 1) {
    chatListsDiv.innerHTML = `<p class="cems__no_found">No Chats found</p>`;
  } else {
    chatListData.map((data) => {
      chatsToggle(data);
    });
  }
};
let gotoUsers = () => {
  chatListsDiv.innerHTML = "";
  chatlistHeaderText.innerText = "Users";
  if (friendList.length < 1) {
    chatListsDiv.innerHTML = `<p class="cems__no_found">No Friend found</p>`;
  } else {
    friendList.map((data) => {
      usersToggle(data);
    });
  }
};
function showMesseges(id) {
  inMessages = true;
  let exactData = chatListData.find((data) => data.id == id);
  console.log(exactData);
  if (exactData == undefined) {
    exactData = friendList.find((data) => data.id == id);

    exactData.messages = [];
  }
  calleeId = exactData.id;
  unreadMessageId = unreadMessageId.filter((id) => id != exactData.id);
  calleeName = exactData.name;
  chatboxChattingDiv.innerHTML = chatboxChating(exactData);
  chatbox.gotoChat();
  scrollBottom();
  filesend();
}

let backToChatList = () => {
  inMessages = false;
  gotoChatList();
  chatbox.backTochatList();
};

let controlSentOrReciveMessage = (data) => {
  let chatboxMessages = document.createElement("ul");

  chatboxMessages.innerHTML = "";

  data.messages.map((m) => {
    let message = m.text;
    if (m.messageType == 2) {
      if (message.substring(0, 27) === "FiLe-https://tradazine.com/") {
        let fileExtention = message.split(".").pop().toLowerCase();
        let fileLink = message.slice(5, message.length);
        let fileName=message.slice(38, message.length);
        if (fileExtention === "jpg" || fileExtention === "png" || fileExtention === "jpeg") {
          chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--operator">
<a href="${fileLink}" download target="_blank">
        <img src="${fileLink}" alt="" style="width:144px">
        </a>
      </div>`;
        } else {
          chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--operator"  >
      <a href="${fileLink}" download target="_blank">
      <img src="https://img.icons8.com/carbon-copy/100/000000/file.png" style="width:70px"/><br>
      <a href="${fileLink}" download target="_blank" style="color:#ffecec">${fileName}</a>
      </a>
      </div>`;
        }
      }else{
      chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--operator">${m.text}</div>`;
    }} else {
      if (message.substring(0, 27) === "FiLe-https://tradazine.com/") {
        let fileExtention = message.split(".").pop().toLowerCase();
        let fileLink = message.slice(5, message.length);
        let fileName=message.slice(38, message.length);
        if (fileExtention === "jpg" || fileExtention === "png" || fileExtention === "jpeg") {
          chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--visitor" >
          <a href="${fileLink}" download target="_blank">
          <img src="${fileLink}" alt="" style="width:144px">
          </a>
      </div>`;
        } else {
          chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--visitor"  >
      <a href="${fileLink}" download target="_blank">
      <img src="https://img.icons8.com/carbon-copy/100/000000/file.png" style="width:70px"/><br>
          <a href="${fileLink}" download target="_blank">${fileName}</a>
      </a>
      </div>`;
        }
      }else{
      chatboxMessages.innerHTML += `<div class="cems__messages__item cems__messages__item--visitor">${m.text}</div>`;
    }}
  });
  return chatboxMessages.innerHTML;
};

let createMessageOutput = (message) => {
  if (message.substring(0, 27) === "FiLe-https://tradazine.com/") {
    let fileExtention = message.split(".").pop().toLowerCase();
    let fileLink = message.slice(5, message.length);
    let fileName=message.slice(38, message.length);
    let createMessageOutput = document.createElement("div");
    createMessageOutput.className = "cems__messages__item cems__messages__item--operator";
    if (fileExtention === "jpg" || fileExtention === "png" || fileExtention === "jpeg") {
      createMessageOutput.innerHTML = `<a href="${fileLink}" download target="_blank">
      <img src="${fileLink}" alt="" style="width:144px">
      </a>`;
    } else {
      createMessageOutput.innerHTML = `<a href="${fileLink}" download target="_blank">
      <img src="https://img.icons8.com/carbon-copy/100/000000/file.png" style="width:70px"/><br>
      <a href="${fileLink}" download target="_blank" style="color:#ffecec">${fileName}</a>
      </a>`;
    }
    document.getElementById("cems__chatbox__messages").appendChild(createMessageOutput);
  } else {
    let createMessageOutput = document.createElement("div");
    createMessageOutput.className = "cems__messages__item cems__messages__item--operator";
    createMessageOutput.innerHTML = `${message}`;
    document.getElementById("cems__chatbox__messages").appendChild(createMessageOutput);
  }
};
let sendMessage = async (id, message = null) => {
  console.log('object')
  if (selectFile !== undefined) {
    console.log('object2')
    document.getElementById("sendMessageBtn").disabled = true;
    let formData = new FormData();
    formData.append("file", selectFile);

    let sendFile = await fetch(`https://tradazine.com/api/v1/store-chat-file`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${allDetails.access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(
          "cems_send_message"
        ).innerHTML = `<input id="cems__input__message" type="text" placeholder="Write a message..." autocomplete="off"/>`;
        selectFile=undefined
        document.getElementById("sendMessageBtn").disabled = false;
       return data
      });

    if (sendFile.errors) {
      alert(sendFile.errors.file[0]);
      return;
    }
    console.log(sendFile.data.path);
    message = {
      text: `FiLe-https://tradazine.com/${sendFile.data.path}`,
      type: "TEXT",
    };
    
  } else {
    if (message == null) {
      typeMessage = document.getElementById("cems__input__message").value;
      message = {
        text: typeMessage,
        type: "TEXT",
      };
      document.getElementById("cems__input__message").value = "";
    }
  }
  
  if (message.text.length == 0) {
    alert("write something");
  } else {
    console.log(message);
    let exactMessagesData = chatListDataStore(message, id, allDetails.userName, "sent");

    newChatListStore(message, id, allDetails.userName, "sent");

    createMessageOutput(message.text);
    var chatEl = document.getElementById("cems__chatbox__messages");
    chatEl.scrollTop = chatEl.scrollHeight;
    await agoraFunction.sendPeerMessage(message, exactMessagesData.id);
  }
};
let filesend = () => {
  console.log(clickFriendId);
  document.getElementById("cems_file_upload").addEventListener("change", function (e) {
    selectFile = e.target.files[0];
    console.log(selectFile)
    if (selectFile === undefined) {
      document.getElementById(
        "cems_send_message"
      ).innerHTML = `<input id="cems__input__message" type="text" placeholder="Write a message..." autocomplete="off"/>`;
    } else {
      let fileName = e.target.files[0].name;
      if (fileName.length > 30) {
        fileName = fileName.substring(0, 30) + "...";
      }
      let filedata = `
      <div id="selectFileShow">
      <p>${fileName}</p>
      </div>
      `;
      document.getElementById("cems_send_message").innerHTML = filedata;
    }
  });
};

let chatListDataStore = (message, id, name, type) => {
  let messageType;
  if (type == "sent") {
    messageType = 2;
  } else {
    messageType = 3;
  }

  let exactMessagesData = chatListData.find((d) => d.id == id);
  if (exactMessagesData == undefined) {
    exactMessagesData = friendList.find((data) => data.id == id);
    exactMessagesData.messages = [
      {
        messageType: messageType,
        text: message.text,
        timeStamp: null,
        username: name,
      },
    ];
    chatListData.unshift(exactMessagesData);
    document.getElementById("cems__chatbox__messages").innerHTML = "";
  } else {
    let withoutExactMessagesData = chatListData.filter((d) => d.id != id);
    if (exactMessagesData.messages.length == 0) {
      document.getElementById("cems__chatbox__messages").innerHTML = "";
    }
    exactMessagesData.messages.push({
      messageType: messageType,
      text: message.text,
      timeStamp: null,
      username: name,
    });
    chatListData = [exactMessagesData, ...withoutExactMessagesData];
  }
  return exactMessagesData;
};
let newChatListStore = (message, id, name, type) => {
  let messageType;
  if (type == "sent") {
    messageType = 2;
  } else {
    messageType = 3;
  }

  let exactMessagesData = newChatList.find((d) => d.id == id);
  if (exactMessagesData == undefined) {
    exactMessagesData = friendList.find((data) => data.id == id);
    exactMessagesData.messages = [
      {
        messageType: messageType,
        text: message.text,
        timeStamp: null,
        username: name,
      },
    ];
    newChatList.unshift(exactMessagesData);
  } else {
    let withoutExactMessagesData = newChatList.filter((d) => d.id != id);

    // exactMessagesData.messages.push({
    //   messageType: 2,
    //   text: message.text,
    //   timeStamp: null,
    //   username: allDetails.userName,
    // });

    newChatList = [exactMessagesData, ...withoutExactMessagesData];
  }
};
let chatboxChating = (data) => {
  clickFriendId = data.id;
  return `
  <div class="cems__chatbox__header">
    <div class="cems__chat__details">
    <div id="cems__chatbox_backButton--header" onclick=backToChatList()>
    <img src="./images/icons/backArrow.svg" alt="" />
    </div>
    <div class="cems__friend__icon">
      <p>${data.name.toUpperCase().charAt(0)}</p>
    </div>
    <div class="cems__chatbox__content--header">
      <h4 class="cems__chatbox__heading--header">${data.name}</h4>
    </div>
  </div>
  <div class="cems__chat__callicon">
  <img src="./images/icons/callIcon.svg" alt="" / onclick=agoraFunction.audioVideoCall('audio')>
  <img src="./images/icons/videocall.svg" alt="" /onclick=agoraFunction.audioVideoCall('video')>
  </div>
</div>
<div id="cems__chatbox__messages" class="cems__messageFor${data.id}">
  ${
    !data.messages.length
      ? `<p class="cems__no_found">No message found</p>`
      : controlSentOrReciveMessage(data)
  }
</div>
<div class="cems__chatbox__footer">
<label for="cems_file_upload"><img src="./images/icons/attachment.svg" alt="" /></label>

<input type="file" id="cems_file_upload" name="cems_file_upload" style="display:none;">
  
  <div id="cems_send_message">
  <input id="cems__input__message" type="text" placeholder="Write a message..." autocomplete="off"/>
  </div>
  <button id="sendMessageBtn" class="cems__chatbox__send--footer" onclick=sendMessage('${data.id}')>Send</button>
  
</div>
  `;
};

// modal script************************
var modal = document.getElementById("cems__myModal");

// Get the button that opens the modal
var btn = document.getElementById("cems__myBtn");

// Get the <span> element that closes the modal

// When the user clicks the button, open the modal
