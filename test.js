let a=[
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
    
  ];
  let b="[{\"name\":\"Zarif\",\"uid\":\"difs-234\",\"messages\":[{\"messageType\":3,\"text\":\"How are you\",\"timeStamp\":null,\"username\":\"Zarif\"},{\"messageType\":2,\"text\":\"I am fine.\",\"timeStamp\":null,\"username\":\"shozonraj\"}]},{\"name\":\"Raj\",\"uid\":\"difs-235\",\"messages\":[{\"messageType\":3,\"text\":\"How are you\",\"timeStamp\":null,\"username\":\"Zarif\"},{\"messageType\":2,\"text\":\"I am fine.\",\"timeStamp\":null,\"username\":\"shozonraj\"}]}]"

  b=JSON.parse(b)
  b.map(d=>console.log(d))