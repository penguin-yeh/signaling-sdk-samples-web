import SignalingManagerStreamChannel from "./signaling_manager_stream_channel.js";
import showMessage from "../utils/showMessage.js";
import handleSignalingEvents from "../utils/handleSignalingEvents.js";
import setupProjectSelector from "../utils/setupProjectSelector.js";
import docURLs from "../utils/docSteURLs.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  let isStreamChannelJoined = false;
  let channelName = "";
  let isTopicJoined = false;
  var isLoggedIn = false;
  var uid;

  // Set the project selector
  setupProjectSelector();

  // Signaling Manager will create the engine and channel for you
  const {
    config,
    fetchTokenAndLogin,
    logout,
    streamChannelJoinAndLeave,
    sendTopicMessage,
    topicJoinAndLeave,
    subscribeTopics,
  } = await SignalingManagerStreamChannel(showMessage, handleSignalingEvents);

  // Buttons
  // Login with custom UID using token received from token generator
  document.getElementById("login").onclick = async function () {
    if (!isLoggedIn) {
      uid = document.getElementById("uid").value.toString();
      if (uid === "") {
        showMessage("Please enter a User ID.");
        return;
      }

      await fetchTokenAndLogin(uid);

      isLoggedIn = true;
      document.getElementById("login").innerHTML = "LOGOUT";
    } else {
      await logout();
      isLoggedIn = false;
      document.getElementById("login").innerHTML = "LOGIN";
    }
  };

  document.getElementById("streamJoinAndLeave").onclick = async function () {
    channelName = document.getElementById("streamChannelName").value.toString();
    await streamChannelJoinAndLeave(isStreamChannelJoined, uid, channelName); // Join and leave logic

    // UI changes for join and leave
    isStreamChannelJoined = !isStreamChannelJoined;
    if (isStreamChannelJoined) {
      document.getElementById("streamJoinAndLeave").innerHTML = "Leave";
    } else {
      document.getElementById("streamJoinAndLeave").innerHTML = "Join";
    }
  };

  document.getElementById("joinTopic").onclick = async function () {
    let topic = document.getElementById("topicName").value.toString();
    
    await topicJoinAndLeave(isTopicJoined, topic); // Join and leave logic
    

    // UI changes for join and leave
    isTopicJoined = !isTopicJoined;
    if (isTopicJoined) {
      document.getElementById("joinTopic").innerHTML = "Leave topic";
    } else {
      document.getElementById("joinTopic").innerHTML = "Join topic";
    }
  };

  document.getElementById("sendTopicMessage").onclick = async function () {
    let message = document.getElementById("topicMessage").value.toString();
    let topicName = document.getElementById("topicName").value.toString();
    console.log(message, topicName);

    sendTopicMessage(message, topicName);
  };

  // Go to the relevant documentation page on docs.agora.io
  document.getElementById("fullDoc").onclick = async function () {
    window.open(docURLs["stream"], "_blank").focus();
  };
};
