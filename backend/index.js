import express from "express";
import { PORT } from "./config.js";
import mongoose from "mongoose";
import { User } from "./models/userModel.js";
import dotenv from "dotenv";
import usersRoute from "./routes/usersRoute.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import e from "express";
dotenv.config();
const connections = {};
const app = express();
let io;
//Poi si puo fare come nell'altro progetto, dividendo le routes in un folder a parte.
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Origin", "X-Requested-With", "Accept"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.status(234).send("Pagina");
});

app.use("/users", usersRoute);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(async () => {
    console.log("App connected to database");

    const server = app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
      io = new Server(server, {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"],
          credentials: true,
        },
      });
      io.on("connection", async (socket) => {
        console.log("New client connected:", socket.handshake.query.email);
        connections[socket.handshake.query.email] = {
          socket: socket,
          id: socket.id,
        };

        const keysConn = Object.keys(connections);
        console.log(keysConn);

        const username = socket.handshake.query.email;

        console.log("ROOMS", io.sockets.adapter.rooms);

        socket.on("disconnect", function () {
          console.log("Disconnect socket", socket.id);

          delete connections[socket.handshake.query.email];

          const keysConn2 = Object.keys(connections);

          console.log("Remaining Sockets", keysConn2);
          console.log("ROOMS", io.sockets.adapter.rooms);
        });
      });

      const changeStream = User.watch([], { fullDocument: "updateLookup" });
      changeStream.on("change", (change) => {
        //
        if (change.operationType == "insert") return;
        //----Check if its a change of notifications array

        const userDoc = change.fullDocument;
        let fieldsKeys = Object.keys(change?.updateDescription.updatedFields);

        let notificationCheck = fieldsKeys.some((key) =>
          key.startsWith("notifications")
        );
        let additionalInfoCheck = fieldsKeys.some((key) =>
          key.startsWith("additionalInfo")
        );
        let pendingRequestsCheck = fieldsKeys.some((key) =>
          key.startsWith("pendingRequests")
        );
        let friendsUpdate = fieldsKeys.some((key) => key.startsWith("friends"));
        //Enters if notifications array changes
        if (notificationCheck) {
          console.log("Notifications changed");
          //Emit event/message to the specific user frontend

          console.log(userDoc.email);
          const socketId = connections[userDoc.email]?.id;
          //if user is not online, don't send alert notification
          if (socketId)
            io.to(socketId).emit("notificationsUpdate", userDoc.notifications);
        }
        if (additionalInfoCheck) {
          console.log("Additionalinfo changed");
          const socketId = connections[userDoc.email]?.id;
          //if user is not online, don't send alert notification
          if (socketId)
            io.to(socketId).emit(
              "additionalInfoUpdate",
              userDoc.additionalInfo
            );
        }

        if (friendsUpdate) {
          console.log("Friends changed");
          const socketId = connections[userDoc.email]?.id;
          //if user is not online, don't send alert notification
          console.log(userDoc.email);
          if (socketId) io.to(socketId).emit("friendsUpdate", userDoc.friends);
        }
        if (pendingRequestsCheck) {
          console.log("Requests Changed");
          const socketId = connections[userDoc.email]?.id;
          if (socketId)
            io.to(socketId).emit(
              "pendingRequestsUpdate",
              userDoc.pendingRequests
            );
        }

        //----------------------------------------------
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
