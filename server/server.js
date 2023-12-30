const express = require('express');
const dotenv = require('dotenv');
const connectionToMongo = require('./config/dbConnection')
const userRoutes = require('./Routes/UserRoutes')
const chatRoutes = require('./Routes/ChatRoutes')
const messageRoutes = require('./Routes/MessageRoutes')
const notFoundRoute = require('./config/notFoundRoute');
const path = require("path");

//env configuration for server
dotenv.config();

const app = express();

//connection to database
connectionToMongo();

//for parsing json data
app.use(express.json());

//Routes
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------



//error handling for routes which not exist
app.use(notFoundRoute);


//server initialization
const server = app.listen(4000, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("connected to Socket.Io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room : " + room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved)
        })
    })

    socket.off('setup', (userData) => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
})