class agoraFuntionality {
  constructor(getModalSection) {
    this.sections = {
      getModalSection: getModalSection,
      getCallingType: null,
    };
    this.uid = "";
    this.userName = "";
    this.appId = "";
    this.token = "";
    this.client = "";
    this.status = "ofline";
    this.remoteInvitation = null;
    this.localInvitation = null;
  }
  hidecall(res){
    this.sections.getCallingType.innerHTML = res;
    document.getElementsByClassName('cems__callButtons')[0].style.display='none'
    setTimeout(() => {
      this.status = "online";
      this.sections.getModalSection.style.display = "none";
    }, 3000);
  }
  async login(uid, name, appId) {
    this.uid = uid;
    this.appId = appId;
    this.userName = name;
    this.token = await this.createAgoraRtmToken(uid);
    this.client = AgoraRTM.createInstance(appId);
    await this.client
      .login({ uid, token: this.token })
      .then(() => {
        this.peerMessageRecive();
        this.RemoteInvitationReceived();
        this.status = "online";
        allDetails.userName = name;
        document
          .getElementById("cems__log")
          .appendChild(document.createElement("div"))
          .append("login as " + name + "id " + uid);
        document.getElementById("cems__chatbox__button").classList.remove("cems__hide__section");
        fetchData(uid);
        gotoChatList();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  init(uid, name, appId) {
    this.login(uid, name, appId);
  }
  async createAgoraRtmToken(userName) {
    try {
      const response = await axios.get(
        `https://agoratokenbs23.herokuapp.com/rtm-token?username=${userName}`
      );
      return await response.data.token;
    } catch (error) {
      console.error(error);
    }
  }
  async sendPeerMessage(message, peerId) {

    scrollBottom();
    if(message.type==='call'){
      return
    }
    await this.client.sendMessageToPeer({ text: message.text }, peerId).then((sendResult) => {
      if (sendResult.hasPeerReceived) {
        document
          .getElementById("cems__log")
          .appendChild(document.createElement("div"))
          .append("Message has been received by: " + peerId + " Message: " + message.text);
      } else {
        document
          .getElementById("cems__log")
          .appendChild(document.createElement("div"))
          .append("Message sent to: " + peerId + " Message: " + message.text);
      }
    });
  }

  peerMessageRecive() {
    this.client.on("MessageFromPeer", function (message, peerId) {

      let withOutUnreadMessageId=unreadMessageId.filter(id=>id!==peerId)
      unreadMessageId=[...withOutUnreadMessageId,peerId]
      reciveMessageStoreAndOutput(message,peerId)
    });
  }


  audioCall = () => {
    if (this.localInvitation !== null) {
      this.localInvitation.removeAllListeners();
      this.localInvitation = null;
    }
    console.log(calleeId);
    this.localInvitation = this.client.createLocalInvitation(calleeId);

    this.localInvitationEvents();
    this.localInvitation._channelId = this.uid.replace(/ /g, "_") + calleeId.replace(/ /g, "_");
    this.localInvitation._content = this.userName;
    this.localInvitation.send();
    this.sections.getModalSection.innerHTML = outgoinCallOutput();
    this.sections.getCallingType = document.getElementById("callingType");
    this.status = "busy";
    this.sections.getModalSection.style.display = "flex";
    sendMessage(calleeId,{text:`You called ${calleeName}`,type:'call'})
  };



  localInvitationEvents = () => {
    // Send call invitation

    this.localInvitation.on("LocalInvitationReceivedByPeer", (r) => {
      this.sections.getCallingType.innerHTML = `Calling ${calleeName}`;
    });
    this.localInvitation.on("LocalInvitationAccepted", (r) => {
      console.log("LocalInvitationAccepted" + r);
    });

    this.localInvitation.on("LocalInvitationCanceled", (r) => {
      console.log("LocalInvitationCanceled" + r);
    });

    this.localInvitation.on("LocalInvitationRefused", (r) => {
      this.hidecall(`${calleeName} busy now` )
    });
    this.localInvitation.on("LocalInvitationFailure", (r) => {
      this.hidecall(r)
    });
  };

  cancelOutgoingCall() {
    this.localInvitation.cancel();
    this.status = "online";
    this.sections.getModalSection.style.display = "none";
  }

  RemoteInvitationReceived() {
    this.client.on("RemoteInvitationReceived", (remoteInvitation) => {
      if (this.status !== "online") {
        console.log("user offline");
        return;
      }
      if (this.remoteInvitation !== null) {
        this.remoteInvitation.removeAllListeners();
        this.remoteInvitation = null;
      }

      this.remoteInvitation = remoteInvitation;
      incomingCallOutput(remoteInvitation._content);
      this.sections.getCallingType = document.getElementById("callingType");
      this.status = "busy";
      this.sections.getModalSection.style.display = "flex";
      this.peerEvents();
      reciveMessageStoreAndOutput({text:`${remoteInvitation._content} called You`,type:'call'},remoteInvitation.callerId)
    });
  }

  peerEvents = () => {
    this.remoteInvitation.on("RemoteInvitationReceived", (r) => {
      console.log("RemoteInvitationReceived" + r);
    });
    this.remoteInvitation.on("RemoteInvitationAccepted", (r) => {
      console.log("RemoteInvitationAccepted" + r);
    });
    this.remoteInvitation.on("RemoteInvitationCanceled", (r) => {
      this.hidecall(`${this.remoteInvitation._content} canceled the call`)
    });
    this.remoteInvitation.on("RemoteInvitationRefused", (r) => {
      console.log('RemoteInvitationRefused ' +r)
      
    });
    this.remoteInvitation.on("RemoteInvitationFailure", (r) => {
      this.hidecall(r)
    });
  };
  cancelIncomingCall() {
    this.remoteInvitation.refuse();
    this.status = "online";
    this.sections.getModalSection.style.display = "none";
  }
  reciveIncomingCall() {
    this.remoteInvitation.accept();
  }
}

let getModalSection = document.getElementById("cems__myModal");
console.log(getModalSection);
let agoraFunction = new agoraFuntionality(getModalSection);

let cancelOutgoingCall = () => {
  agoraFunction.cancelOutgoingCall();
};
let reciveIncomingCall=()=>{
  agoraFunction.reciveIncomingCall()
}
let cancelIncoingCall=()=>{
  agoraFunction.cancelIncomingCall()
}
let createRecivedMessageOutput = (message, peerId) => {
  let createMessageOutput = document.createElement("div");
  createMessageOutput.className = "cems__messages__item cems__messages__item--visitor";
  createMessageOutput.innerHTML = `${message}`;
  let className = peerId.replace(/ /g, "_");
  let isClass = document.getElementsByClassName(`cems__messageFor${className}`)[0];

  if (isClass !== undefined) {
    unreadMessageId=unreadMessageId.filter(uid=>uid!==peerId)
    isClass.appendChild(createMessageOutput);
  }
};

let fetchData = (uid) => {
  let data = JSON.parse(localStorage.getItem(`CemsChatDataFor${uid.replace(/ /g, "_")}`));
  if (data === null) {
    // friendList=[]
    // chatListData=[]
  } else {
    if (data.friendList === undefined) {
      friendList = [];
    } else {
      friendList = data.friendList;
    }
    if (data.chatListData === undefined) {
      chatListData = [];
    } else {
      chatListData = data.chatListData;
    }
  }
  if (uid === "difs-238") {
    let withoutData = chatListData.filter((data) => data.uid !== uid);
    let alData = chatListData.find((data) => data.uid === "difs-235");
    chatListData = withoutData;
    console.log(alData);
    if (alData === undefined) {
      chatListData.unshift({
        name: "Raj",
        uid: "difs-235",
        messages: [],
      });
    }
  } else {
    let withoutData = chatListData.filter((data) => data.uid !== uid);
    let alData = chatListData.find((data) => data.uid === "difs-238");
    chatListData=withoutData
    if (alData === undefined) {
      chatListData.unshift({
        name: "shozon raj",
        uid: "difs-238",
        messages: [],
      });
    }
  }
  console.log(JSON.stringify(chatListData))
};

let outgoinCallOutput = () => {
  return `
  <div id="cems__callsection">
       <div id="cems__call__content">
         <h3 class="cems__calltype">Outgoing Call</h3>
         <div  class="cems__callImage" >
           <img class="cems__callImage" src="https://img.icons8.com/ios/50/000000/user-male-circle.png"/>
         <h4 id='callingType'>Call ${calleeName} </h4>
         <div class="cems__callButtons" >
           <button class="cems__cancleBtn" onclick=cancelOutgoingCall()>Cancle</button>
         </div>
       </div>
   </div>
  `;
};

let incomingCallOutput = (name) => {
  let output = `
  <div id="cems__callsection">
       <div id="cems__call__content">
         <h3 class="cems__calltype">Incoming Call</h3>
         <div  class="cems__callImage" >
           <img class="cems__callImage" src="https://img.icons8.com/ios/50/000000/user-male-circle.png"/>
         <h4 id='callingType'>Call from ${name} </h4>
         <div class="cems__callButtons">
           <button class="cems__cancleBtn" onclick=cancelIncoingCall()>Cancle</button>
           <button class="cems__reciveBtn" onclick=reciveIncomingCall()>Recive</button>
         </div>
       </div>
   </div>
  `;
  getModalSection.innerHTML = output;
};

let reciveMessageStoreAndOutput=(message, peerId)=>{
  
  let exactMessagesData = chatListData.find((d) => d.uid === peerId);
  if (exactMessagesData === undefined) {
    exactMessagesData = friendList.find((data) => data.uid === peerId);
    exactMessagesData.messages = [
      {
        messageType: 3,
        text: message.text,
        timeStamp: null,
        username: peerId,
      },
    ];
    chatListData.unshift(exactMessagesData);
    document.getElementById("cems__chatbox__messages").innerHTML = "";
    createRecivedMessageOutput(message.text, peerId);
  } else {
    let withoutExactMessagesData = chatListData.filter((d) => d.uid !== peerId);
    if (exactMessagesData.messages.length === 0) {
      document.getElementById("cems__chatbox__messages").innerHTML = "";
    }
    exactMessagesData.messages.push({
      messageType: 3,
      text: message.text,
      timeStamp: null,
      username: peerId,
    });
    chatListData = [exactMessagesData, ...withoutExactMessagesData];
    createRecivedMessageOutput(message.text, peerId);
  }
  scrollBottom();
  gotoChatList();
  var chatEl = document.getElementById("cems__chatbox__messages");
  chatEl.scrollTop = chatEl.scrollHeight;
  document
    .getElementById("cems__log")
    .appendChild(document.createElement("div"))
    .append("Message from: " + peerId.replace(/ /g, "_") + " Message: " + message.text);
}

// **********************************************

const log = console.log.bind(console);
