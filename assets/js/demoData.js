let userName='shozonraj'
// Your app ID
const appID = "9726a69c2bd448108598e9e5a3d7e0d4"
let calleeId='s'
let chatListData = [
  {
    friendName: "Zarif",
    id: "chatlistData1",
    messages: [
      {
        messageType: 3,
        text: "Zarif Called you",
        timeStamp: null,
        username: "Zarif",
      },
      {
        messageType: 2,
        text: "shozonraj Called you",
        timeStamp: null,
        username: "shozonraj",
      },
      {
        messageType: 2,
        text: "shozonraj Called you",
        timeStamp: null,
        username: "shozonraj",
      },
      {
        messageType: 3,
        text: "<sprite=1><sprite=1><sprite=1> dfgry segre gbredg retg rgrdg regh",
        timeStamp: null,
        username: "Zarif",
      },
    ],
  },
  {
    friendName: "Raj",
    id: "chatlistData2",
    messages: [],
  },
  
];
let friendList = [
  {
    id: "chatlistData1",
    friendName: "Zarif",
  },
  
  {
    friendName: "Raj",
    id: "chatlistData2"
  },
  {
    friendName: "Raj1",
    id: "chatlistData3"
  },
  {
    friendName: "Raj3",
    id: "chatlistData4"
  },
  {
    friendName: "shozon raj",
    id: "chatlistData5"
  }
  
  
];


let data=JSON.parse(localStorage.getItem(`CemsChatDataFor${userName.replace(/ /g, "_")}`))
if(data===null){
  // friendList=[]
  // chatListData=[]
}else{
  if(data.friendList===undefined){
    friendList=[]
  }else{
    friendList=data.friendList
  }
  if (data.chatListData===undefined){
    chatListData=[]
  }else{
    chatListData=data.chatListData
  }

}

  window.addEventListener("beforeunload", function (e) {
    let CemsChatData={friendList:friendList,chatListData:chatListData}
    localStorage.setItem(`CemsChatDataFor${userName.replace(/ /g, "_")}`,JSON.stringify(CemsChatData))
  });