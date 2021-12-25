class agoraFuntionality {
  constructor(getModalSection) {
    this.sections = {
      getModalSection: getModalSection,
      getCallingType: null,
    };
    this.rtc = {
      localAudioTrack: null,
      localVideoTrack: null,
      client: null,
    };
    this.uid = "";
    this.userName = "";
    this.appId = "";
    this.rtmToken = "";
    this.channelId=''
    this.rtcToken=''
    this.rtmClient = "";
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

  async login(uid, name, appId,access_token) {
    this.uid = uid;
    this.appId = appId;
    this.userName = name;
    this.rtmToken = await this.createAgoraRtmToken(uid);
    this.rtmClient = AgoraRTM.createInstance(appId);
    await this.rtmClient
      .login({ uid, token: this.rtmToken })
      .then(async() => {
        // let data=await getChatData(access_token,uid)
        this.peerMessageRecive();
        this.RemoteInvitationReceived();
        this.status = "online";
        allDetails.userName = name;
        allDetails.userId=uid
        document
          .getElementById("cems__log")
          .appendChild(document.createElement("div"))
          .append("login as " + name + "id " + uid);
        document.getElementById("cems__chatbox__button").classList.remove("cems__hide__section");
         fetchData(uid);
        gotoChatList();
        friendList=await getFriendListData(access_token,uid)
        this.joinReciveCallReciver()
      })
      .catch((err) => {
        console.log(err);
      });
  }
  init(uid, name, appId,access_token) {
    this.login(uid.toString(), name, appId,access_token);
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
  async createAgoraRtcToken(){
    try {
       const response = await axios.get(
        `https://agoratokenbs23.herokuapp.com/rtc-uid-token?channelName=${this.channelId}&uid=${this.uid}`
      );
      return await response.data.token;
    } catch (error) {
      console.error(error);
    }
  }
  async sendPeerMessage(message, peerId) {
    
    scrollBottom();
    if(message.type=='call'){
      return
    }
    await this.rtmClient.sendMessageToPeer({ text: message.text }, peerId.toString()).then((sendResult) => {
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
    this.rtmClient.on("MessageFromPeer", function (message, peerId,proper) {
      let withOutUnreadMessageId=unreadMessageId.filter(id=>id!=peerId)
      unreadMessageId=[...withOutUnreadMessageId,peerId]
      reciveMessageStoreAndOutput(message,peerId)
    });
  }


   audioCall = async() => {
    if (this.localInvitation != null) {
      this.localInvitation.removeAllListeners();
      this.localInvitation = null;
    }
    this.localInvitation = this.rtmClient.createLocalInvitation(calleeId.toString());

    this.localInvitationEvents();
    this.channelId=this.uid+ calleeId;
    this.localInvitation._channelId = this.uid+ calleeId;
    console.log(this.localInvitation._channelId);
    this.localInvitation._content = this.userName;
    this.localInvitation.send();
    this.sections.getModalSection.innerHTML = outgoinCallOutput();
    this.sections.getCallingType = document.getElementById("callingType");
    this.status = "busy";
    this.sections.getModalSection.style.display = "flex";
    sendMessage(calleeId,{text:`You called ${calleeName}`,type:'call'})
    this.rtcToken=await this.createAgoraRtcToken()
    console.log(this.rtcToken)
    
  };



  localInvitationEvents = () => {
    // Send call invitation

    this.localInvitation.on("LocalInvitationReceivedByPeer", (r) => {
      this.sections.getCallingType.innerHTML = `Calling ${calleeName}`;
    });
    this.localInvitation.on("LocalInvitationAccepted", (r) => {
      this.joinReciveCallSender()
      recivedCallOutput()
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

 async RemoteInvitationReceived() {
    this.rtmClient.on("RemoteInvitationReceived", async(remoteInvitation) => {
      if (this.status != "online") {
        console.log("user offline");
        return;
      }
      if (this.remoteInvitation != null) {
        this.remoteInvitation.removeAllListeners();
        this.remoteInvitation = null;
      }

      this.remoteInvitation = remoteInvitation;
      this.channelId=remoteInvitation._channelId
      this.rtcToken=await this.createAgoraRtcToken()
      console.log(this.rtcToken)
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
      this.joinReciveCallSender()
      recivedCallOutput()
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
// **********audio video *************


 async joinReciveCallReciver(){
  this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  this.rtc.client.on("user-published", async (user, mediaType) => {
    await this.rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === "video") {
      const remoteVideoTrack = user.videoTrack;
      const fricon = document.getElementById("cems__call__reciver");
      remoteVideoTrack.play(fricon);
    }
    if (mediaType === "audio") {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack.play();
    }
    this.rtc.client.on("user-unpublished", async(user) => {
        console.log('object')
          this.rtc.localAudioTrack.close();
          this.rtc.localVideoTrack.close();
          // Leave the channe.
          await this.rtc.client.leave();
          this.sections.getModalSection.style.display = "none";
    });
  });
 }
 async joinReciveCallSender (){
   console.log(this.appId, this.channelId,this.rtcToken, this.uid)
      await this.rtc.client.join(this.appId, this.channelId,this.rtcToken, this.uid);
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      const mycon = document.getElementById("cems__call__sender");
      this.rtc.localVideoTrack.play(mycon);
      console.log("publish success!");
    };
 async leaveReciveCall(){
      this.rtc.localAudioTrack.close();
      this.rtc.localVideoTrack.close();
      // Leave the channel.
      await this.rtc.client.leave();
      this.sections.getModalSection.style.display = "none";
    };

}


let getModalSection = document.getElementById("cems__myModal");
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
let cancelRecivedCall=()=>{
  agoraFunction.leaveReciveCall()
}
let createRecivedMessageOutput = (message, peerId) => {
  let createMessageOutput = document.createElement("div");
  createMessageOutput.className = "cems__messages__item cems__messages__item--visitor";
  createMessageOutput.innerHTML = `${message}`;
  let className = peerId.replace(/ /g, "_");
  let isClass = document.getElementsByClassName(`cems__messageFor${className}`)[0];

  if (isClass != undefined) {
    unreadMessageId=unreadMessageId.filter(uid=>uid!=peerId)
    isClass.appendChild(createMessageOutput);
  }
};

let recivedCallOutput=()=>{
  let output = `
  <div id="cems__callsection">
       <div id="cems__call__content">
       <div id="cems__call__sender"></div>
         <div id="cems__call__reciver"></div>
         <div class="cems__callButtons" >
           <button id="recivedCallCancle" onclick=cancelRecivedCall()>Cancle</button>
         </div>
         
       </div>
   </div>
  `;
  getModalSection.innerHTML = output;
}

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
  let peerDetails=friendList.find(d=>d.id==peerId)
console.log(peerDetails);
  chatListDataStore(message,peerId,peerDetails.name,'recive')
    
    newChatListStore(message,peerId,peerDetails.name,'recive')

    createRecivedMessageOutput(message.text, peerId);
  scrollBottom();
  gotoChatList();
  var chatEl = document.getElementById("cems__chatbox__messages");
  chatEl.scrollTop = chatEl.scrollHeight;
  document
    .getElementById("cems__log")
    .appendChild(document.createElement("div"))
    .append("Message from: " + peerId.replace(/ /g, "_") + " Message: " + message.text);
}


let getChatData=async(authToken,uid)=>{
  try {
    let response=await axios.get(`https://tradazine.com/api/v1/all-chat-message/${uid}`,{
      headers: {'Authorization': `Bearer ${authToken}`}
    })
    return await response
  } catch(err){
    console.error(err)
  }
}
let getFriendListData=async(authToken,uid)=>{
  try {
    let response=await axios.get(`https://tradazine.com/api/v1/get-all-users`,{
      headers: {'Authorization': `Bearer ${authToken}`}
    })
    let friendlist=await response.data.data.filter(d=>d.id!=uid)
    return await friendlist
  } catch(err){
    console.error(err)
  }
}

const log = console.log.bind(console);
