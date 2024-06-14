import AgoraRTM from "agora-rtm-sdk";
import config from "./config.json";

const SignalingManager = async (messageCallback, eventsCallback, rtmConfig) => {

  // The Signaling RTMEngine instance
  let signalingEngine = null;
  let signalingChannel = null;

  // Set up the signaling engine with the provided App ID, UID, and configuration
  const setupSignalingEngine = async (rtmConfig) => {
    try {
      rtmConfig = rtmConfig || {
        token: config.token,
        useStringUserId: config.useStringUserId,
        logUpload: config.logUpload,
        presenceTimeout: config.presenceTimeout,
      };
      signalingEngine = new AgoraRTM.RTM(config.appId, config.uid, rtmConfig);
    } catch (error) {
      console.log("Error:", error);
    }

    // Add listeners to handle event notifications
    // Message event handler
    signalingEngine.addEventListener("message", eventArgs => {
      eventsCallback("message", eventArgs);
      messageCallback(
        "Received message from " +
          eventArgs.publisher +
          ": " +
          eventArgs.message
      );
    });
    // State event handler
    signalingEngine.addEventListener("status", eventArgs => {
      eventsCallback("status", eventArgs);
      messageCallback(
        "Connection state changed to: " +
          eventArgs.state +
          ", Reason: " +
          eventArgs.reason
      );
    });
    // Presence event handler
    signalingEngine.addEventListener("presence", eventArgs => {
      eventsCallback("presence", eventArgs);
      if (eventArgs.eventType === "SNAPSHOT") {
        messageCallback(
          `Join channel ${eventArgs.channelName} successfully!!`
        );
        console.log(eventArgs.snapshot);
      } else {
        messageCallback(
          "Presence event: " +
            eventArgs.eventType +
            ", User: " +
            eventArgs.publisher
        );
      }
    });
    // Storage event handler
    signalingEngine.addEventListener("storage", eventArgs => {
      eventsCallback("storage", eventArgs);
    });
    // Topic event handler
    signalingEngine.addEventListener("topic", eventArgs => {

      // const action = eventArgs.evenType; // The action. Should be one of 'SNAPSHOT'、'JOIN'、'LEAVE'.
      // const channelName = eventArgs.channelName; // The channel this event came from
      // const publisher = eventArgs.userId; // Who triggered this event
      // const topicInfos = eventArgs.topicInfos; // Topic information payload
      // const totalTopics = eventArgs.totalTopics; // How many topics

      eventsCallback("topic", eventArgs);
      if(eventArgs.eventType == "SNAPSHOT"){
        messageCallback(
          "Topic event: " +
            eventArgs.eventType
        );
      }
      else{
        messageCallback(
          "Topic event: " +
            eventArgs.eventType +
            ", User: " +
            eventArgs.topicInfos[0].publishers[0].publisherUserId
        );
      }

      console.log("www--- " + eventArgs.topicInfos);
    });
    // Lock event handler
    signalingEngine.addEventListener("lock", eventArgs => {
      eventsCallback("lock", eventArgs);
    });
    // TokenPrivilegeWillExpire event handler
    signalingEngine.addEventListener("TokenPrivilegeWillExpire", eventArgs => {
      eventsCallback("TokenPrivilegeWillExpire ", eventArgs);
    });   

  };

  // Login to the signaling engine
  const login = async (uid, token) => {
    try {
      if (uid !== undefined) config.uid = uid;
      if (token !== undefined) config.token = token;

      await setupSignalingEngine(rtmConfig);
      const result = await signalingEngine.login();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getSignalingEngine = () => {
    return signalingEngine;
  };

  // Logout from the signaling engine
  const logout = async () => {
    await signalingEngine.logout();
  };

  const createChannel = async (channelName) => {
    // Create a signalingChannel
    channelName = channelName || config.channelName;
    try {
      signalingChannel = await signalingEngine.createStreamChannel(channelName);
    } catch (error) {
      console.error(error);
    }
  };

  // Subscribe to a channel
  const subscribe = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      const subscribeOptions = {
        withMessage: true,
        withPresence: true,
        withMetadata: true,
        withLock: true,
      };
      await signalingEngine.subscribe(channelName, subscribeOptions);
    } catch (error) {
      console.log(error);
    }
  };

  // Unsubscribe a channel
  const unsubscribe = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      await signalingEngine.unsubscribe(channelName);
      messageCallback("You have successfully left channel " + channelName);
    } catch (error) {
      console.log(error);
    }
  };

  // Send a message to a channel
  const sendChannelMessage = async (channelName, Message) => {
    const payload = { type: "text", message: Message };
    const publishMessage = JSON.stringify(payload);
    try {
      const sendResult = await signalingEngine.publish(
        channelName,
        publishMessage
      );
      messageCallback(`Message sent to channel ${channelName}: ${Message}`);
    } catch (error) {
      console.log(error);
    }
  };

  // Get list of active members in the channel
  const getOnlineMembersInChannel = async (channelName, channelType) => {
    const result = await getSignalingEngine().presence.getOnlineUsers(
      channelName,
      channelType
    );
    return result.occupants;
  };



  // Return the signaling engine and the available functions
  return {
    getSignalingEngine,
    config,
    login,
    logout,
    createChannel,
    subscribe,
    unsubscribe,
    sendChannelMessage,
    getOnlineMembersInChannel,
  };
};

export default SignalingManager;
