const wsHandler = (ws) => {
  console.log("WS::Client connected");

  ws.on("message", (data) => {
    console.log("received: %s", data);
  });
};

module.exports.wsHandler = wsHandler;
