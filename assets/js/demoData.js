
let calleeId='s'
let calleeName=''
let clickFriendId=''
let selectFile=undefined
let unreadMessageId=[]
let inMessages=false
let options = {
  channel: "143142",
  uid: 143,
};
let cmsloc = window.location.pathname;
let cmsdir = cmsloc.substring(1, cmsloc.lastIndexOf('/'));
console.log(cmsdir)
let allDetails={
   userName:'',
   userId:'',
   access_token:''
}
let newChatList=[]
let chatListData = [
  {
    name: "Zarif",
    id: 234,
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
    id: 235,
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



  window.addEventListener("beforeunload", function (e) {
    localStorage.setItem(`CemsChatDataFor${allDetails.userId}`, JSON.stringify(chatListData))
  });

//   window.onbeforeunload = function(e) {
//     if(newChatList!==[]){
//       return (async () => {
//         await fetch(`https://tradazine.com/api/v1/store-chat-message?text=${JSON.stringify(newChatList)}`, {
//          method: 'POST',
//          headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/json',
//            'Authorization': `Bearer ${allDetails.access_token}`
//          }
//        });
//      })();
//     }
//  };
  
let fetchData = (uid,allMessage=[]) => {
    let testd=[]
allMessage.map(am=>{
  let strStart=am.text[0]
  let strEnd=am.text[am.text.length-1]
  if(strStart==="[" && strEnd==="]"){
    let parseAm=JSON.parse(am.text)
    parseAm.map(d=>{
      let isa=true
      testd.map(td=>{
        if(d.id===td.id){
          td.messages=[...td.messages,...d.messages]
          isa=false
        }
      })
      if(isa===true){
        testd.unshift(d)
      }
    })
  }else{
    console.log(strStart,am.text[am.text.length-2]) 
  }
})

  let data = JSON.parse(localStorage.getItem(`CemsChatDataFor${uid}`));
  console.log(data);
  if (data === null) {
    // friendList=[]
    // chatListData=[]
  } else {

    if (data=== undefined) {
      chatListData = [];
    } else {
      chatListData = data
    }
  }
  // chatListData=testd
  addchangeUser(uid)
};
let addchangeUser=(uid)=>{
  
  if (uid === "242") {
    let withoutData = chatListData.filter((data) => data.id !== uid);
    let alData = chatListData.find((data) => data.id == "243");
    chatListData = withoutData;
    console.log(alData);
    if (alData === undefined) {
      chatListData.push({
        name: "user4",
        id: "243",
        messages: [],
      });
    }
  } else {
    let withoutData = chatListData.filter((data) => data.id != uid);
    let alData = chatListData.find((data) => data.id == "242");
    chatListData=withoutData
    if (alData === undefined) {
      chatListData.push({
        name: "User3",
        id: "242",
        messages: [],
      });
    }
  }
}




console.log('DD');