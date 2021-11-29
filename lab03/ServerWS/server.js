const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 9090 });

let loggedUser = []


webSocketServer.on('connection', webSocket => {
    console.log("Client connected: ", webSocketServer.clients.size)
    webSocket.on('message', message => {
        console.log('Received:', JSON.parse(message));
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.typeMessage) {
            case 'login':
                // broadcast(JSON.stringify({ type: "allUser", data: loggedUser }))
                if (!loggedUser.find(user => user.userId === parsedMessage.userId)) {
                    loggedUser.push(parsedMessage)
                    console.log(loggedUser)
                    console.log("loggedUser after login:", loggedUser)

                }
                loggedUser.forEach(user => broadcast(JSON.stringify(user)))
                // broadcast(JSON.stringify(parsedMessage))
                break;
            case 'logout':
                loggedUser = loggedUser.filter(user => user.userId !== parsedMessage.userId);
                console.log("loggedUser after Logout:", loggedUser)
                broadcast(JSON.stringify(parsedMessage))
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