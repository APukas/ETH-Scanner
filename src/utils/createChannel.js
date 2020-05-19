const createChannel = (connection, func = () => {}) => {
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError;
    }

    func(channel);
  });
}

export default createChannel;