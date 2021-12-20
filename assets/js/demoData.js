
let calleeId='s'
let calleeName=''
let unreadMessageId=[]
let allDetails={
   userName:'',
}

let chatListData = [
  {
    name: "Zarif",
    uid: "difs-234",
    messages: [
      {
        messageType: 3,
        text: "How are you",
        timeStamp: null,
        username: "Zarif",
      },
      {
        messageType: 2,
        text: "I am fine.",
        timeStamp: null,
        username: "shozonraj",
      }
    ],
  },
  {
    name: "Raj",
    uid: "difs-235",
    messages: [],
  },
  
];
let friendList = [
  {
    uid: "difs-234",
    name: "Zarif",
  },
  
  {
    name: "Raj",
    uid: "difs-235"
  },
  {
    name: "shozon raj",
    uid: "difs-238"
  },
  {
    name: "Raj1",
    uid: "difs-236"
  },
  {
    name: "Raj3",
    uid: "difs-237"
  },
  {
    name: "shozonraj",
    uid: "difs-233"
  }
];



  // window.addEventListener("beforeunload", function (e) {
  //   let CemsChatData={friendList:friendList,chatListData:chatListData}
  //   localStorage.setItem(`CemsChatDataFor${uid.replace(/ /g, "_")}`,JSON.stringify(CemsChatData))
  // });