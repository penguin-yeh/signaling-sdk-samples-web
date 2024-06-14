import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerStreamChannel = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback
  );

  const topicJoinAndLeave = async function (isTopicJoined, topicName) {
    if (isTopicJoined === false) {
      await signalingManager.getSignalingStreamChannel().joinTopic(topicName).then(async (response) => {
        messageCallback("Joined the topic: ----" + response.topicName + "-----");
        console.log("ppppppp----" + topicName + "----ppppppp");
      });    
    } else {
      signalingManager.getSignalingStreamChannel().leaveTopic(topicName).then((response) => {
        console.log(response);
        messageCallback("Left the topic: " + response.topicName);
      });
    }
  }; 
   
  const sendTopicMessage = function (message, topicName) {
    if (message === "" || topicName === "") {
      console.log(
        "Make sure you specified a message and a topic to send messages"
      );
      return;
    }
    signalingManager.getSignalingStreamChannel().publishTopicMessage(topicName, message).then((response) => {
      console.log("123333" , response);
      messageCallback("Topic: " + topicName + ",  Message:" + message);
    });
    // signalingManager.getSignalingStreamChannel().subscribeTopic(topicName).then((response) => {
    //   console.log("124444" , response);
    // });
  };

  const subscribeTopics = async function(topicName){
    try{
      const result = await signalingManager.getSignalingStreamChannel().subscribeTopic(topicName);
      console.log(result);
    }catch(status){
        console.log(status);
    } 
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    sendTopicMessage,
    topicJoinAndLeave,
    subscribeTopics,
  };
};

export default SignalingManagerStreamChannel;
