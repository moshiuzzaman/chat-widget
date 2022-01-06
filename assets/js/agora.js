class agoraFuntionality {
  constructor(getModalSection) {
    this.sections = {
      getModalSection: getModalSection,
      getCallingType: null,
    };
    this.localTracks = {
      localAudioTrack: null,
      localVideoTrack: null,
    };
    this.mute = false;
    this.rtcClient = null;
    this.uid = "";
    this.userName = "";
    this.appId = "";
    this.rtmToken = "";
    this.channelId = "";
    this.rtcToken = "";
    this.rtmClient = "";
    this.status = "ofline";
    this.remoteInvitation = null;
    this.localInvitation = null;
  }
  hidecall(res) {
    this.sections.getCallingType.innerHTML = res;
    document.getElementsByClassName("cems__callButtons")[0].style.display = "none";
    setTimeout(() => {
      this.status = "online";
      this.sections.getModalSection.style.display = "none";
    }, 3000);
  }

  async login(uid, name, appId, access_token) {
    this.uid = uid;
    this.appId = appId;
    this.userName = name;
    this.rtmToken = await this.createAgoraRtmToken(uid);
    this.rtmClient = AgoraRTM.createInstance(appId);
    await this.rtmClient
      .login({ uid, token: this.rtmToken })
      .then(async () => {
        // let data=await getChatData(access_token,uid)
        this.peerMessageRecive();
        this.RemoteInvitationReceived();
        this.status = "online";
        allDetails.userName = name;
        allDetails.userId = uid;
        allDetails.access_token=access_token
        document
          .getElementById("cems__log")
          .appendChild(document.createElement("div"))
          .append("login as " + name + "id " + uid);
        document.getElementById("cems__chatbox__button").classList.remove("cems__hide__section");
        fetchData(uid);
        gotoChatList();
        friendList = await getFriendListData(access_token, uid);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  init(uid, name, appId, access_token) {
    this.login(uid.toString(), name, appId, access_token);
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
  async createAgoraRtcToken() {
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
    if (message.type == "call") {
      return;
    }
    await this.rtmClient
      .sendMessageToPeer({ text: message.text }, peerId.toString())
      .then((sendResult) => {
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
    this.rtmClient.on("MessageFromPeer", function (message, peerId, proper) {
      let withOutUnreadMessageId = unreadMessageId.filter((id) => id != peerId);
      unreadMessageId = [...withOutUnreadMessageId, peerId];
      console.log(unreadMessageId);
      reciveMessageStoreAndOutput(message, peerId);
    });
  }

  audioVideoCall = async (type) => {
    if (this.localInvitation != null) {
      this.localInvitation.removeAllListeners();
      this.localInvitation = null;
    }
    this.localInvitation = this.rtmClient.createLocalInvitation(calleeId.toString());

    this.localInvitationEvents();
    this.channelId = this.uid + calleeId;
    this.localInvitation._channelId = this.uid + calleeId;
    this.localInvitation._content = {
      name: this.userName,
      type: type,
    };
    this.calltype = type;
    this.localInvitation.send();
    this.sections.getModalSection.innerHTML = outgoinCallOutput(type);
    this.sections.getCallingType = document.getElementById("callingType");
    this.status = "busy";
    this.sections.getModalSection.style.display = "flex";
    sendMessage(calleeId, { text: `You gave ${calleeName} a ${type} call `, type: "call" });
    this.rtcToken = await this.createAgoraRtcToken();
    console.log(this.rtcToken);
    this.joinReciveCallReciver(type);
  };

  localInvitationEvents = () => {
    // Send call invitation

    this.localInvitation.on("LocalInvitationReceivedByPeer", (r) => {
      this.sections.getCallingType.innerHTML = `Calling ${calleeName}`;
    });
    this.localInvitation.on("LocalInvitationAccepted", (r) => {
      this.joinReciveCallSender(this.localInvitation._content.type);
      recivedCallOutput(this.localInvitation._content.type);
    });

    this.localInvitation.on("LocalInvitationCanceled", (r) => {
      console.log("LocalInvitationCanceled" + r);
    });

    this.localInvitation.on("LocalInvitationRefused", (r) => {
      this.hidecall(`${calleeName} busy now`);
    });
    this.localInvitation.on("LocalInvitationFailure", (r) => {
      this.hidecall(r);
    });
  };

  cancelOutgoingCall() {
    this.localInvitation.cancel();
    this.status = "online";
    this.sections.getModalSection.style.display = "none";
  }

  async RemoteInvitationReceived() {
    this.rtmClient.on("RemoteInvitationReceived", async (remoteInvitation) => {
      if (this.status != "online") {
        console.log("user offline");
        remoteInvitation.refuse();
        return;
      }
      if (this.remoteInvitation != null) {
        this.remoteInvitation.removeAllListeners();
        this.remoteInvitation = null;
      }
      this.remoteInvitation = remoteInvitation;
      this.channelId = remoteInvitation._channelId;
      this.rtcToken = await this.createAgoraRtcToken();
      incomingCallOutput(remoteInvitation._content.name, remoteInvitation._content.type);
      this.calltype = remoteInvitation._content.type;
      this.sections.getCallingType = document.getElementById("callingType");
      this.status = "busy";
      this.sections.getModalSection.style.display = "flex";
      this.peerEvents();
      reciveMessageStoreAndOutput(
        { text: `${remoteInvitation._content.name} called You`, type: "call" },
        remoteInvitation.callerId
      );
      this.joinReciveCallReciver(remoteInvitation._content.type);
    });
  }

  peerEvents = () => {
    this.remoteInvitation.on("RemoteInvitationReceived", (r) => {
      console.log("RemoteInvitationReceived" + r);
    });
    this.remoteInvitation.on("RemoteInvitationAccepted", (r) => {
      this.joinReciveCallSender(this.remoteInvitation._content.type);
      recivedCallOutput(this.remoteInvitation._content.type);
    });
    this.remoteInvitation.on("RemoteInvitationCanceled", (r) => {
      this.hidecall(`${this.remoteInvitation._content.name} canceled the call`);
    });
    this.remoteInvitation.on("RemoteInvitationRefused", (r) => {
      console.log("RemoteInvitationRefused " + r);
    });
    this.remoteInvitation.on("RemoteInvitationFailure", (r) => {
      this.hidecall(r);
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

  async joinReciveCallReciver(type) {
    this.rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    this.rtcClient.on("user-published", async (user, mediaType) => {
      await this.rtcClient.subscribe(user, mediaType);
      console.log("subscribe success");
      if (type == "video") {
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          const fricon = document.getElementById("cems__call__reciver");
          remoteVideoTrack.play(fricon);
        }
      }

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
      this.rtcClient.on("user-unpublished", async (user, mediaType) => {
        console.log("unpublish", user, mediaType);
      });
      this.rtcClient.on("user-info-updated", async (user, msg) => {
        console.log("updated", user, msg);
      });
      this.rtcClient.on("user-left", async (user, res) => {
        this.localTracks.localAudioTrack.close();
        this.localTracks.localVideoTrack && this.localTracks.localVideoTrack.close();
      this.localTracks.screenVideoTrack && this.localTracks.screenVideoTrack.close()
        // Leave the channe.
        await this.rtcClient.leave();
        this.sections.getModalSection.style.display = "none";
        this.status = "online";
        clearInterval(callInterval);
        mute = false;
      });
    });
  }
  async joinReciveCallSender(type) {
    console.log(this.appId, this.channelId, this.rtcToken, this.uid);
    await this.rtcClient.join(this.appId, this.channelId, this.rtcToken, this.uid);
    this.localTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    if (type == "video") {
      this.localTracks.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      await this.rtcClient.publish([
        this.localTracks.localAudioTrack,
        this.localTracks.localVideoTrack,
      ]);
      const mycon = document.getElementById("cems__call__sender");
      this.localTracks.localVideoTrack.play(mycon);
    } else {
      await this.rtcClient.publish([this.localTracks.localAudioTrack]);
    }

    console.log("publish success!");
  }

  muteAudio() {
    this.localTracks.localAudioTrack.close();
  }
  async unmuteAudio() {
    this.localTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
    await this.rtcClient.publish([this.localTracks.localAudioTrack]);
  }
  async screenshareOn() {
    this.localTracks.screenVideoTrack = await AgoraRTC.createScreenVideoTrack();
    await this.rtcClient.unpublish([this.localTracks.localVideoTrack]);
    this.localTracks.localVideoTrack.close();
    await this.rtcClient.publish([this.localTracks.screenVideoTrack]);
    const mycon = document.getElementById("cems__call__sender");
    this.localTracks.screenVideoTrack.play(mycon);
    this.localTracks.screenVideoTrack.on("track-ended", async() => {
      screenshare()
    })
  }
  async screenshareOff() {
    console.log(this.localTracks)
      this.rtcClient.unpublish([this.localTracks.screenVideoTrack]);
      this.localTracks.screenVideoTrack.close();
      this.localTracks.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    console.log(this.localTracks)
        await this.rtcClient.publish([this.localTracks.localVideoTrack]);
    const mycon = document.getElementById("cems__call__sender");
        this.localTracks.localVideoTrack.play(mycon);
        let getscreenShareBtn = document.getElementById("cems_shareScreenBtn");
        getscreenShareBtn.innerHTML = `<img src="../../images/icons/shareScreen.svg" alt="" class="cems__cancleBtn"  id="screenShare" onclick=screenshare()>`;
  }
  async leaveReciveCall() {
    
    this.localTracks.localVideoTrack && this.localTracks.localVideoTrack.close();
      this.localTracks.screenVideoTrack && this.localTracks.screenVideoTrack.close()
    this.localTracks.localAudioTrack.close();
    // Leave the channel.
    await this.rtcClient.leave();
    this.sections.getModalSection.style.display = "none";
    this.status = "online";
    clearInterval(callInterval);
    mute = false;
  }
}

let getModalSection = document.getElementById("cems__myModal");
let agoraFunction = new agoraFuntionality(getModalSection);

let cancelOutgoingCall = () => {
  agoraFunction.cancelOutgoingCall();
};
let reciveIncomingCall = () => {
  agoraFunction.reciveIncomingCall();
};
let cancelIncoingCall = () => {
  agoraFunction.cancelIncomingCall();
};
let cancelRecivedCall = () => {
  agoraFunction.leaveReciveCall();
};
let screenShare = false;
let screenshare = () => {
  let getscreenShareBtn = document.getElementById("cems_shareScreenBtn");
  if (screenShare !== false) {
    agoraFunction.screenshareOff();
  } else {
    agoraFunction.screenshareOn();
    getscreenShareBtn.innerHTML = `<img src="../../images/icons/shareScreenoff.svg" alt="" class="cems__cancleBtn"  id="screenShare" onclick=screenshare()>`;
  }
  screenShare = !screenShare;
};
let createRecivedMessageOutput = (message, peerId) => {
  let createMessageOutput = document.createElement("div");
  if (message.substring(0, 27) === "FiLe-https://tradazine.com/") {
    let fileExtention = message.split(".").pop().toLowerCase();
    let fileLink = message.slice(5, message.length);
    let fileName=message.slice(38, message.length);
    createMessageOutput.className = "cems__messages__item cems__messages__item--visitor";
    
    if (fileExtention === "jpg" || fileExtention === "png" || fileExtention === "jpeg") {
      createMessageOutput.innerHTML = ` <a href="${fileLink}" download target="_blank">
      <img src="${fileLink}" alt="" style="width:144px">
      </a>`;
    } else {
      createMessageOutput.innerHTML = ` <a href="${fileLink}" download target="_blank">
      <img src="https://img.icons8.com/carbon-copy/100/000000/file.png" style="width:70px"/><br>
          <a href="${fileLink}" download target="_blank">${fileName}</a>
      </a>`;
    }
    document.getElementById("cems__chatbox__messages").appendChild(createMessageOutput);
  } else {
  
  createMessageOutput.className = "cems__messages__item cems__messages__item--visitor";
  createMessageOutput.innerHTML = `${message}`;
  }
  let className = peerId;
  let isClass = document.getElementsByClassName(`cems__messageFor${className}`)[0];
  if (inMessages == true) {
    if (isClass != undefined) {
      unreadMessageId = unreadMessageId.filter((uid) => uid != peerId);
      isClass.appendChild(createMessageOutput);
    }
  }
};
let mute = false;
let mutecontrol = () => {
  let getMuteButton = document.getElementById("muteMicrophone");
  if (mute !== false) {
    agoraFunction.unmuteAudio();
    getMuteButton.innerHTML = `<img src="../../images/icons/microphone.svg" alt="" class="cems__cancleBtn"   onclick=mutecontrol()>`;
  } else {
    agoraFunction.muteAudio();
    getMuteButton.innerHTML = `<img src="../../images/icons/muteMicrophone.svg" alt="" class="cems__cancleBtn"   onclick=mutecontrol()>`;
  }
  console.log(mute);
  mute = !mute;
};
let recivedCallOutput = (type) => {
  console.log("mute" + mute);
  let output = `
  <div id="cems__callsection">
       
       ${
         type == "video"
           ? `<div id="cems__recivedcall__content">
         <div id="cems__call__sender"></div>
         <div id="cems__call__reciver"></div>`
           : `<div id="cems__call__content">
         <div  class="cems__callImage" >
           <img class="cems__callImage" src="https://img.icons8.com/ios/50/000000/user-male-circle.png"/>
         <h4 id='callingType'> talking with ${calleeName} </h4>
       </div>
         `
       }
         <div id="cams__call__timer"><span id="minutes"></span>:<span id="seconds"></span></div>
         <div class="cems__callButtons" >
        <span id="muteMicrophone"><img src="../../images/icons/microphone.svg" alt="" class="cems__cancleBtn"   onclick=mutecontrol()></span>
         ${
           type == "video" &&
           `<span id="cems_shareScreenBtn"><img src="../../images/icons/shareScreen.svg" alt="" class="cems__cancleBtn"  id="screenShare" onclick=screenshare()></span>`
         }
         <img src="../../images/icons/callred.svg" alt="" class="cems__cancleBtn"  id="recivedCallCancle" onclick=cancelRecivedCall()>
         </div>
         
       </div>
   </div>
  `;
  getModalSection.innerHTML = output;
  callTimer();
};
let callInterval;
let callTimer = () => {
  var sec = 0;
  function pad(val) {
    return val > 9 ? val : "0" + val;
  }
  callInterval = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
  }, 1000);
};
let outgoinCallOutput = (type) => {
  return `
  <div id="cems__callsection">
       <div id="cems__call__content">
         <h3 class="cems__calltype">Outgoing Call</h3>
         <div  class="cems__callImage" >
           <img class="cems__callImage" src="https://img.icons8.com/ios/50/000000/user-male-circle.png"/>
         <h4 id='callingType'> Call ${calleeName} </h4>
         <div class="cems__callButtons" >
           <img src="../../images/icons/callred.svg" alt="" class="cems__cancleBtn" onclick=cancelOutgoingCall()>

         </div>
       </div>
   </div>
  `;
};

let incomingCallOutput = (name, type) => {
  calleeName = name;
  let output = `
  <div id="cems__callsection">
       <div id="cems__call__content">
         <h3 class="cems__calltype">Incoming Call</h3>
         <div  class="cems__callImage" >
           <img class="cems__callImage" src="https://img.icons8.com/ios/50/000000/user-male-circle.png"/>
         <h4 id='callingType'>Call from ${name} </h4>
         <div class="cems__callButtons">
           <img src="../../images/icons/callred.svg" alt="" class="cems__cancleBtn" onclick=cancelIncoingCall()>
           ${
             type === "audio"
               ? `<img src="../../images/icons/callgreen.svg" alt="" class="cems__reciveBtn" onclick=reciveIncomingCall()>`
               : `<img src="../../images/icons/videocallgreen.svg" alt="" class="cems__reciveBtn" onclick=reciveIncomingCall()>`
           }
           
         </div>
       </div>
   </div>
  `;
  getModalSection.innerHTML = output;
};

let reciveMessageStoreAndOutput = (message, peerId) => {
  let peerDetails = friendList.find((d) => d.id == peerId);
  chatListDataStore(message, peerId, peerDetails.name, "recive");

  newChatListStore(message, peerId, peerDetails.name, "recive");
  createRecivedMessageOutput(message.text, peerId);
  scrollBottom();
  gotoChatList();
  var chatEl = document.getElementById("cems__chatbox__messages");
  chatEl.scrollTop = chatEl.scrollHeight;
  document
    .getElementById("cems__log")
    .appendChild(document.createElement("div"))
    .append("Message from: " + peerId + " Message: " + message.text);
};

let getChatData = async (authToken, uid) => {
  try {
    let response = await axios.get(`https://tradazine.com/api/v1/all-chat-message/${uid}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return await response;
  } catch (err) {
    console.error(err);
  }
};
let getFriendListData = async (authToken, uid) => {
  try {
    let response = await axios.get(`https://tradazine.com/api/v1/get-all-users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    let friendlist = await response.data.data.filter((d) => d.id != uid);
    return await friendlist;
  } catch (err) {
    console.error(err);
  }
};

const log = console.log.bind(console);
if (cmsdir === "/") {
  cmsdir = "../../";
}
