
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
      scrollBottom()
        await client.sendMessageToPeer(
            { text: peerMessage },
            peerId,
        ).then(sendResult => {
            
            if (sendResult.hasPeerReceived) {
                document.getElementById("log").appendChild(document.createElement('div')).append("Message has been received by: " + peerId + " Message: " + peerMessage)
                
            } else {

                document.getElementById("log").appendChild(document.createElement('div')).append("Message sent to: " + peerId + " Message: " + peerMessage)
                

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
    createMessageOutput.className="cems__messages__item cems__messages__item--visitor"
    createMessageOutput.innerHTML=`${message}`
    let className=peerId.replace(/ /g,"_")
    let isClass=document.getElementsByClassName(`cems__messageFor${className}`)[0]
    console.log('objectff11')
    if(isClass!==undefined){
        console.log('object11')
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
      document.getElementById('cems__chatbox__messages').innerHTML=''
      createRecivedMessageOutput(message.text,peerId)
    }else{
      let withoutExactMessagesData=chatListData.filter((d) => d.friendName !== peerId);
      if(exactMessagesData.messages.length===0){
        document.getElementById('cems__chatbox__messages').innerHTML=''
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
    scrollBottom()
    gotoChatList()
    var chatEl = document.getElementById("cems__chatbox__messages");
      chatEl.scrollTop = chatEl.scrollHeight
    document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId.replace(/ /g,"_") + " Message: " + message.text)
})
