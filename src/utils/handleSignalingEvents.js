const handleSignalingEvents = (eventName, eventArgs) => {
  if (eventName == "MessageFromPeer") {
  } else if (eventName == "ConnectionStateChanged") {
  } else if (eventName == "ChannelMessage") {
  } else if (eventName == "MemberJoined") {
  } else if (eventName == "MemberLeft") {
  } else if (eventName == "topic"){
    const action = eventArgs.evenType; // The action. Should be one of 'SNAPSHOT'、'JOIN'、'LEAVE'.
    const channelName = eventArgs.channelName; // The channel this event came from
    const publisher = eventArgs.userId; // Who triggered this event
    const topicInfos = eventArgs.topicInfos; // Topic information payload
    const totalTopics = eventArgs.totalTopics; // How many topics

    console.log(action);
    console.log(channelName);
    console.log(publisher);
    console.log(topicInfos);
    console.log(totalTopics);
    
  }
};

export default handleSignalingEvents;
