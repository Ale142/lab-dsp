const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 9090 });
/**
 * {
 *  id:
 *  connection: webSocket
 *  ...user
 * }
 */
let loggedUserMessages = [], loggedUserConnections = []

webSocketServer.on('connection', webSocket => {
    console.log("Client connected: ", webSocketServer.clients.size)
    webSocket.on('message', message => {
        console.log('Received:', JSON.parse(message));
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.typeMessage) {
            case 'login':
                // broadcast(JSON.stringify({ type: "allUser", data: loggedUser }))

                // Update loggedUserConnnections
                if (!loggedUserConnections.find(user => user.userId === parsedMessage.userId))
                    // Insert if the connection is newer
                    loggedUserConnections.push({ userId: parsedMessage.userId, connection: webSocket });
                else
                    // Update the connection if already the userid was inserted
                    loggedUserConnections = loggedUserConnections.map(user => user.userId === parsedMessage ? ({ user: user.userId, connection: webSocket }) : user)

                console.log("Connections:", loggedUserConnections);
                if (!loggedUserMessages.find(user => user.userId === parsedMessage.userId)) {
                    loggedUserMessages.push(parsedMessage)
                    console.log("loggedUser after login:", loggedUserMessages)

                }


                // Send to all the client the newer message
                loggedUserConnections.forEach(item => item.connection.send(JSON.stringify(parsedMessage)));

                // To the new connected client just send all the previous logged in messages but without the newer one
                loggedUserMessages.filter(msg => msg.userId !== parsedMessage.userId).forEach(msg => webSocket.send(JSON.stringify(msg)));
                //loggedUser.forEach(item => selectiveBroadcast(JSON.stringify(item.user), item.))

                // broadcast(JSON.stringify(parsedMessage))
                break;
            case 'logout':
                loggedUserConnections = loggedUserConnections.filter(user => user.userId !== parsedMessage.userId);
                loggedUserMessages = loggedUserMessages.filter(msg => msg.userId !== parsedMessage.userId);
                loggedUserConnections.forEach(user => user.connection.send(JSON.stringify(parsedMessage)));
                // loggedUser = loggedUser.filter(user => user.userId !== parsedMessage.userId);
                // console.log("loggedUser after Logout:", loggedUser)
                // broadcast(JSON.stringify(parsedMessage))
                break;

            case 'update':
                loggedUserConnections.forEach(user => user.connection.send(JSON.stringify(parsedMessage)));
                break;
        }

    });
});


// send data to all clients having an open connection
function broadcast(data) {
    webSocketServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            // If the state of the connected client is OPEN then we send data to them
            client.send(data);
        }
    });
}