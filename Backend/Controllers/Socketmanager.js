const {Server} =require("socket.io");

const connection = {};
const message = {};
const timeOnline = {};

 const connectToServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected successfully");

        socket.on("join-call", (path) => {
            if (connection[path] === undefined) {
                connection[path] = [];
            }

            connection[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            for (let a = 0; a < connection[path].length; a++) {
                io.to(connection[path][a]).emit("user-joined", socket.id, connection[path]);
            }

            if (message[path] !== undefined) {
                for (let m = 0; m < message[path].length; m++) {
                    io.to(socket.id).emit("chat-messages",
                        message[path][m]['data'],
                        message[path][m]['sender'],
                        message[path][m]['socket-id-sender']
                    )
                }
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

       socket.on("chat-message",(data,sender)=>{
        let matchingroom=null;
        for(const  room in connection){
          if(connection[room].includes(socket.id)){
            matchingroom=room;
            break;
          }
        }
        if(matchingroom){
          if(!message[matchingroom]){
            message[matchingroom]=[];
          }
        }
        message[matchingroom].push({
          'data':data,
          'sender':sender,
          "socket-id-sender":socket.id
        })
        console.log("message", matchingroom, ":", sender, data);

      connection[matchingroom].forEach((usersocketid)=>{
        io.to(usersocketid).emit("chat-message",data,sender,socket.id)
      })


       })

        socket.on("disconnect", () => {
            let roomName = null;
            for (let room in connection) {
                if (connection[room].includes(socket.id)) {
                    roomName = room;
                    break;
                }
            }

            if (roomName) {
                connection[roomName].forEach(userId => {
                    io.to(userId).emit("user-left", socket.id);
                });

                connection[roomName] = connection[roomName].filter(userId => userId !== socket.id);

                if (connection[roomName].length === 0) {
                    delete connection[roomName];
                }
            }
        });
    });

    return io;
}


module.exports={connectToServer}