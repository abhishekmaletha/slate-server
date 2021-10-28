var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
// let connections = [];
let cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
const {
    userJoin,
    showUsers,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require("./utils");

io.on("connect", (socket) => {
    // connections.push(socket);
    socket.on('joinRoom', (data) => {
        console.log(data);
        const user = userJoin(socket.id, data.user, data.room);
        socket.join(user.room);
        console.log(`${user.username} has joined ${user.room}`);

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        // showUsers();
    });
    // console.log(`${socket.id} has connected`);
    socket.on('send', (data) => {
        showUsers();
        console.log(socket.id);
        console.log('data in sever ', data);
        const user = getCurrentUser(socket.id);
        console.log('curr user', user);
        io.to(user.room).emit('draw', data);
    });
    //Disconnect
    socket.on("disconnect", () => {
        console.log(`${socket.id} was disconnected`);
        // connections = connections.filter((con) => con.id !== socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 4000;
http.listen(server_port, () => {
    console.log("Started on : " + server_port);
});