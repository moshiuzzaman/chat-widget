
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

  
let fetchData = (uid,allMessage) => {
    let testd=[]
allMessage.map(am=>{
  console.log(am)
  let strStart=am.text[0]
  let strEnd=am.text[am.text.length-1]
  if(strStart==="[" && strEnd==="]"){
    let parseAm=JSON.parse(am.text)
    parseAm.map(d=>{
      let isa=true
      testd.map(td=>{
        if(d.uid===td.uid){
          td.messages=[...td.messages,...d.messages]
          isa=false
        }
      })
      if(isa===true){
        testd.push(d)
      }
    })
  }else{
    console.log(strStart,am.text[am.text.length-2])
    
  }
  
  
  
})

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
  chatListData=testd
  addchangeUser(uid)
};
let addchangeUser=(uid)=>{
  
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
}