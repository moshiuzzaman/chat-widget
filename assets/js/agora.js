class agoraFuntionality {
  constructor() {
    this.userName = '';
     this.appId ='';
    this.token = "";
    this.client = '';

  }

  async login(uid, name, appId) {
    this.uid=uid
    this.appId=appId
    this.userName=name
    this.token = await this.createAgoraRtmToken(uid);
    this.client = AgoraRTM.createInstance(appId);
    await this.client
      .login({ uid, token: this.token })
      .then(() => {
        this.peerMessageRecive()
        allDetails.userName = name;
        document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append("login as " + name + "id " + uid);
        document.getElementById("cems__chatbox__button").classList.remove("cems__hide__section");
        fetchData(uid)
        gotoChatList();
      })
      .catch((err) => {
        console.log(err.messages);
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
  async sendPeerMessage(peerMessage, peerId) {
    scrollBottom();
    await this.client.sendMessageToPeer({ text: peerMessage }, peerId).then((sendResult) => {
      if (sendResult.hasPeerReceived) {
        document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append("Message has been received by: " + peerId + " Message: " + peerMessage);
      } else {
        document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append("Message sent to: " + peerId + " Message: " + peerMessage);
      }
    });
  }

  
  peerMessageRecive() {
    this.client.on("MessageFromPeer", function (message, peerId) {
      let exactMessagesData = chatListData.find((d) => d.uid === peerId);
      if (exactMessagesData === undefined) {
        console.log("object");
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
        .getElementById("log")
        .appendChild(document.createElement("div"))
        .append("Message from: " + peerId.replace(/ /g, "_") + " Message: " + message.text);
    });
    
  }
 
 

}

let agoraFunction = new agoraFuntionality();

 let createRecivedMessageOutput  =(message, peerId)=> {
    let createMessageOutput = document.createElement("div");
    createMessageOutput.className = "cems__messages__item cems__messages__item--visitor";
    createMessageOutput.innerHTML = `${message}`;
    let className = peerId.replace(/ /g, "_");
    let isClass = document.getElementsByClassName(`cems__messageFor${className}`)[0];

    console.log("objectff11");
    if (isClass !== undefined) {
      console.log("object11");
      isClass.appendChild(createMessageOutput);
    }
  };

  let fetchData=(uid)=>{
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
  }

  // **********************************************

let 




const log = console.log.bind(console);
let status = "ofline";
let remoteInvitation = null;
let localInvitation = null;
const audioCall = () => {
  if (localInvitation !== null) {
    localInvitation.removeAllListeners();
    localInvitation = null;
  }
  localInvitation = client.createLocalInvitation(calleeId);

  localInvitationEvents();
  localInvitation.chanel = userName.replace(/ /g, "_") + calleeId.replace(/ /g, "_");
  localInvitation.send();
};
let localInvitationEvents = () => {
  // Send call invitation
  
  localInvitation.on("LocalInvitationReceivedByPeer", (r) => {
    console.log("LocalInvitationReceivedByPeer" + r);
  });
  localInvitation.on("LocalInvitationAccepted", (r) => {
    console.log("LocalInvitationAccepted" + r);
  });
  
  localInvitation.on("LocalInvitationCanceled", (r) => {
    console.log("LocalInvitationCanceled" + r);
  });
  
  localInvitation.on("LocalInvitationRefused", (r) => {
    console.log("LocalInvitationRefused" + r);
  });
  localInvitation.on("LocalInvitationFailure", (r) => {
    console.log("LocalInvitationFailure" + r);
  });
  
};

client.on("RemoteInvitationReceived", (remoteInvitation) => {
  if (remoteInvitation !== null) {
    remoteInvitation.removeAllListeners();
    remoteInvitation = null;
  }
  
  remoteInvitation = remoteInvitation;
  console.log('object')
  // peerEvents();
});

let peerEvents=()=>{
  remoteInvitation.on('RemoteInvitationAccepted',(r)=>{
    console.log('RemoteInvitationAccepted'+ r)
  })
  remoteInvitation.on('RemoteInvitationCanceled',(r)=>{
    console.log('RemoteInvitationCanceled'+ r)
  })
  remoteInvitation.on('RemoteInvitationRefused',(r)=>{
    console.log('RemoteInvitationRefused'+ r)
  })
  remoteInvitation.on('RemoteInvitationFailure',(r)=>{
    console.log('RemoteInvitationFailure'+ r)
  })
  
}