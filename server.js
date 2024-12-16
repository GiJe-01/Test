const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let posts = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const post = JSON.parse(message);
        posts.push(post);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(posts));
            }
        });
    });

    ws.send(JSON.stringify(posts));
});

console.log('WebSocket server is running on ws://localhost:8080');
