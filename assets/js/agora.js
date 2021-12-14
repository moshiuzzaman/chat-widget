
class agoraFuntionality{
    constructor(userName,appId,client){
        this.userName=userName,
        this.appID=appID
        this.token=''
        this.client=client
    }
    async login(){
        this.token =await this.createAgoraRtmToken(this.userName)
        await client.login({uid:this.userName,token:this.token})
    }
   async logout(){
        await client.logout()
    }
    async createAgoraRtmToken(userName){
        try {
            const response = await axios.get(`https://agoratokenbs23.herokuapp.com/rtm-token?username=${userName}`);
            return await response.data.token
          } catch (error) {
            console.error(error);
          }
    }
    async sendPeerMessage(peerMessage,peerId){
        await client.sendMessageToPeer(
            { text: peerMessage },
            peerId,
        ).then(sendResult => {
            if (sendResult.hasPeerReceived) {

                document.getElementById("log").appendChild(document.createElement('div')).append("Message has been received by: " + peerId + " Message: " + peerMessage)
                return 'recive'
            } else {

                document.getElementById("log").appendChild(document.createElement('div')).append("Message sent to: " + peerId + " Message: " + peerMessage)
                return 'sent'

            }
        })
    }
}

let userName='shozonraj'
// Your app ID
const appID = "9726a69c2bd448108598e9e5a3d7e0d4"
// Initialize client
const client = AgoraRTM.createInstance(appID)


let agoraFunction=new agoraFuntionality(userName,appID,client)
agoraFunction.login()
// Params for login
let options = {
    uid: "",
    token: ""
}



// Client Event listeners
// Display messages from peer

let createRecivedMessageOutput=(message,peerId)=>{
    let createMessageOutput=document.createElement('div')
    createMessageOutput.className="messages__item messages__item--visitor"
    createMessageOutput.innerHTML=`${message}`
    let className=peerId.replace(/ /g,"_")
    let isClass=document.getElementsByClassName(`messageFor${className}`)[0]
    if(isClass!==undefined){
        isClass.appendChild(createMessageOutput)
    }
}

client.on('MessageFromPeer', function (message, peerId) {

    let exactMessagesData = chatListData.find((d) => d.friendName === peerId);
    if(exactMessagesData===undefined){
      exactMessagesData = friendList.find((data) => data.friendName === peerId);
      exactMessagesData.messages=[{
          messageType: 3,
          text: message.text,
          timeStamp: null,
          username: peerId,
      }]
      chatListData.unshift(exactMessagesData)
      document.getElementById('chatbox__messages').innerHTML=''
      createRecivedMessageOutput(message.text,peerId)
    }else{
      let withoutExactMessagesData=chatListData.filter((d) => d.friendName !== peerId);
      if(exactMessagesData.messages.length===0){
        document.getElementById('chatbox__messages').innerHTML=''
      }
      exactMessagesData.messages.push({
          messageType: 3,
          text: message.text,
          timeStamp: null,
          username: peerId,
      })
      chatListData=[exactMessagesData,...withoutExactMessagesData ]
      createRecivedMessageOutput(message.text,peerId)
    }
    gotoChatList()
    document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId.replace(/ /g,"_") + " Message: " + message.text)
})
