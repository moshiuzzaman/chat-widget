
// Params for login
let options = {
    uid: "",
    token: ""
}

// Your app ID
const appID = "9726a69c2bd448108598e9e5a3d7e0d4"
// Your token
async function getUser(option) {
    try {
      const response = await axios.get(`https://agoratokenbs23.herokuapp.com/rtm-token?username=${options.uid}`);
      return await response.data.token
    } catch (error) {
      console.error(error);
    }
  }


// Initialize client
const client = AgoraRTM.createInstance(appID)

// Client Event listeners
// Display messages from peer
client.on('MessageFromPeer', function (message, peerId) {

    document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + message)
})
// Display connection state changes
client.on('ConnectionStateChanged', function (state, reason) {

    document.getElementById("log").appendChild(document.createElement('div')).append("State changed To: " + state + " Reason: " + reason)

})

let channel = client.createChannel("demoChannel")

channel.on('ChannelMessage', function (message, memberId) {

    document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message)

})
// Display channel member stats
channel.on('MemberJoined', function (memberId) {

    document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")

})
// Display channel member stats
channel.on('MemberLeft', function (memberId) {

    document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")

})

// Button behavior
window.onload = function () {

    // Buttons
    // login
     async function login() {
        options.uid='shozonraj'
        let token =await getUser(options)
        options.token=token
        await client.login(options)
    }
login()
    // logout
    document.getElementById("logout").onclick = async function () {
        await client.logout()
    }

    // create and join channel
    document.getElementById("join").onclick = async function () {
        // Channel event listeners
        // Display channel messages
        await channel.join().then (() => {
            document.getElementById("log").appendChild(document.createElement('div')).append("You have successfully joined channel " + channel.channelId)
        })
    }

    // leave channel
    document.getElementById("leave").onclick = async function () {

        if (channel != null) {
            await channel.leave()
        }

        else
        {
            console.log("Channel is empty")
        }

    }

    // send peer-to-peer message
    document.getElementById("send_peer_message").onclick = async function () {

        let peerId = document.getElementById("peerId").value.toString()
        let peerMessage = document.getElementById("peerMessage").value.toString()

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

    // send channel message
    document.getElementById("send_channel_message").onclick = async function () {

        let channelMessage = document.getElementById("channelMessage").value.toString()

        if (channel != null) {
            await channel.sendMessage({ text: channelMessage }).then(() => {

                document.getElementById("log").appendChild(document.createElement('div')).append("Channel message: " + channelMessage + " from " + channel.channelId)

            }

            )
        }
    }
}