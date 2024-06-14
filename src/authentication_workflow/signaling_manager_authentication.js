import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerAuthentication = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Get the config
  const config = signalingManager.config;

  // Fetches the Signaling token
  async function fetchToken(uid) {
    if (config.serverUrl !== "") {
      try {
        const res = await fetch(
          // config.proxyUrl +
          config.serverUrl +
          "/rtm/" +
          uid +
          "/?expiry=" +
          config.tokenExpiryTime,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
        const data = await res.text();
        const json = await JSON.parse(data);
        console.log("RTM token fetched from server: ", json.rtmToken);
        return json.rtmToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return config.token;
    }
  }

  const fetchTokenAndLogin = async (uid) => {
    const token = await fetchToken(uid);
    signalingManager.login(uid, token);
  };

  // Fetches the RTC token for stream channels
  async function fetchRTCToken(uid, channelName) {
    if (config.serverUrl !== "") {
      try {
        const res = await fetch(
          // config.proxyUrl +
          config.serverUrl +
          "/rtc/" +
          channelName +
          "/" +
          role +
          "/uid/" +
          uid +
          "/?expiry=" +
          config.tokenExpiryTime,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
        const data = await res.text();
        const json = await JSON.parse(data);
        console.log("RTC token fetched from server: ", json.rtcToken);
        return json.rtcToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return config.rtcToken;
    }
  }

  const streamChannelJoinAndLeave = async function (
    isStreamChannelJoined,
    uid,
    streamChannelName
  ) {
    const token = await fetchRTCToken(uid, streamChannelName);
    if (getSignalingStreamChannel() === null) {
      streamChannel = await signalingManager
        .getSignalingEngine()
        .createStreamChannel(streamChannelName); // creates stream channel
    }

    if (isStreamChannelJoined === false) {
      await streamChannel
        .join({
          token: token,
          withPresence: true,
        })
        .then((response) => {
          console.log(response);
        });
    } else {
      streamChannel.leave().then((response) => {
        console.log(response);
        messageCallback("Left the channel: " + streamChannelName);
        streamChannel = null;
      });
    }

    const options = {
      includeUserId : true ,
      includeState : true,
    }

    try{
        const result = await signalingManager.getSignalingEngine().presence.getOnlineUsers( streamChannelName, "STREAM", options );

        const userIds = {};
        result.occupants.forEach((occupant, index) => {
          userIds[`userId${index}`] = occupant.userId;
        });
        console.log(userIds)
        console.log(result);
    } catch(status){
        console.log(status);
    }
  };

  const getSignalingStreamChannel = () => {
    console.log("this is sc", streamChannel);
    return streamChannel;
  };

  const renewToken = async (uid) => {
    const token = await fetchToken(uid);
    const result = await signalingManager
      .getSignalingEngine()
      .renewToken(token);
    messageCallback("Token was about to expire so it was renewed...");
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    renewToken,
    fetchTokenAndLogin,
    streamChannelJoinAndLeave,
    getSignalingStreamChannel,
  };
};

export default SignalingManagerAuthentication;
