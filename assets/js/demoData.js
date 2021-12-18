
let calleeId='s'
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
    name: "Raj1",
    uid: "difs-236"
  },
  {
    name: "Raj3",
    uid: "difs-237"
  },
  {
    name: "shozon raj",
    uid: "difs-238"
  }
  
  
];



  window.addEventListener("beforeunload", function (e) {
    let CemsChatData={friendList:friendList,chatListData:chatListData}
    localStorage.setItem(`CemsChatDataFor${uid.replace(/ /g, "_")}`,JSON.stringify(CemsChatData))
  });