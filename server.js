import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
// import middleware
import { logEvents, logger } from "./middleware/logEvents.js";
// import routings
import userRoute from "./routes/user.route.js";
import rolesRoute from "./routes/roles.route.js";
import permissionsRoute from "./routes/permissions.route.js";
import authRoute from "./routes/auth.route.js";
import jobRoute from "./routes/jobs.route.js";
import userPermissionsRoute from "./routes/userPermissions.route.js";
import jobAssigningRoute from "./routes/jobAssigning.route.js";
import notificationsRoute from "./routes/notifications.route.js";
import commentsRoute from "./routes/comments.route.js";
import chatsRouter from "./routes/chats.route.js";
import messageRouter from "./routes/message.route.js";
import reportRouter from "./routes/report.route.js";
import rootRouter from "./routes/root.router.js";
import corsOptions from "./config/corsOptions.js";
// connectings
dotenv.config();
connectToDB();

// middlewares
const app = express();
// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_SOCKET_URL,
  },
});

app.use(express.json({ limit: "50MB" }));
app.use(express.static("./public"));
app.use(express.urlencoded({ limit: "50MB", extended: true }));
app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());

// use routinga
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/roles", rolesRoute);
app.use("/api/v1/permissions", permissionsRoute);
app.use("/api/v1/user-permissions", userPermissionsRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/comment", commentsRoute);
app.use("/api/v1/job-assign", jobAssigningRoute);
app.use("/api/v1/chats", chatsRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationsRoute);
app.use("/api/v1/report", reportRouter);
// app.use("/", rootRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello From Server!</h1>");
});

// app.use(function (err, req, res, next) {
//      console.error(err.stack);
//      res.status(500).send('Something broke!');
// });

const PORT = process.env.PORT || 5000;
// if mongoose connecting to database
const DB = mongoose.connection;
DB.once("open", () => {
  // Server Connecting
  server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
});

io.on("connection", (socket) => {
  console.log("Conneced to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData);
    socket.emit("connected");
    console.log(userData);
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("this" + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));

  socket.on("sendMessage", (newMessageRecived) => {
    let chat = newMessageRecived.chat;

    console.log("chat", chat);
    // console.log(newMessageRecived.sender._id);

    if (!chat.users) return console.log("Chat user is not define");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) {
        console.log(newMessageRecived.sender._id);
        return;
      }
      console.log(user._id);
      socket.in(user._id).emit("messageRecived", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("disconnecting");
    socket.leave(userData);
  });
});


