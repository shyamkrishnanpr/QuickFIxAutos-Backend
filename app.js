import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import db from "./config/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import adminRouter from "./routes/adminRoutes.js";
import serviceRoute from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const port = process.env.PORT ||3000;

dotenv.config();
db();
const app = express();
const server = createServer(app);


app.use((req, res, next) => {                      
  res.setHeader('Access-Control-Allow-Origin', "https://quickfixautos.netlify.app");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Enable credentials

  next();
});


app.use(cors({
  credentials: true,
  origin: ["https://quickfixautos.netlify.app","http://localhost:3005"],
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
}))




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('dev'))
app.use("/admin", adminRouter);
app.use("/vendor", serviceRoute);
app.use("/user", userRoutes);


const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    credentials: true,
    origin:["https://quickfixautos.netlify.app","http://localhost:3005"]
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userId) => {
    console.log("setup worked");
    if (!userId) {
      socket.emit("error", "Invalid userData");
      return;
    }
    console.log("userData : ", userId);
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    try {
      socket.join(room);
      console.log("User Joined Room: " + room);
    } catch (error) {
      console.log("error at join chat");
    }
  });

  socket.on("new message", (newMessageReceived) => {
    console.log(newMessageReceived);
    var recieverId = newMessageReceived.conversationId;

    if (!newMessageReceived.conversationId)
      return console.log("chat not defined");

    socket.in(recieverId).emit("message received", newMessageReceived);
  });

  socket.on("disconnect", (userId) => {
    console.log("USER DISCONNECTED");
    if (userId) {
      socket.leave(userId);
    }
  });
});



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
