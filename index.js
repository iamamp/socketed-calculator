const port = process.env.PORT || 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer(); // a regular http server
server.listen(port);
console.log('listening on 8000');

//a webSocketServer which listens to what http server has to say 
const wsServer = new webSocketServer({  
    httpServer: server
});

const clients = {};

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

var logs = [];

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' 
    //+ Object.getOwnPropertyNames(clients) //this is a horribly large object that i do not want to log
    );

    //send away all existing logs to this new joinee
    for(var i=0; i<logs.length; i++){
        clients[userID].sendUTF(logs[i]);
        console.log('sent Message ', logs[i],' to new joinee: ', key);
    }
        
            
        
        
        
    


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
          console.log('Received Message: ', message.utf8Data);
          console.log(JSON.parse(message.utf8Data))

          

          //append this message to logs if size less than 10
          if(logs.length <= 10) logs.push(message.utf8Data);
          else {
            logs = logs.slice(1);
            logs.push(message.utf8Data);
          }
            
          console.log('logs object is ',logs.toString());
          // broadcasting message to all connected clients
          for(key in clients) {
            clients[key].sendUTF(message.utf8Data);
            console.log('sent Message to: ', key);
          }
        }
    })
});