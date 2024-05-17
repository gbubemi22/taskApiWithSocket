import { Server, Socket } from "socket.io";
import {
  handleCreateSocketEvent,
  handleDeleteTaskSocketEvent,
  handleListAllTaskSocketEvent,
  handleListOneTaskSocketEvent,
  handleUpdateTaskSocketEvent,
} from "./modules/event.ts/event-gateway.js";

import { verifyToken } from "./middleware/auth.js";

// Create a new namespace for tasks
const taskNamespace = "/tasks";

const io = new Server();

// Use the default namespace for general events
io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  console.log(`User connected with session ID: ${socket.id}`);

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Use the task namespace for task-related events
const taskIo = io.of(taskNamespace);

taskIo.on("connection", (socket: Socket) => {
  console.log("A user connected to task namespace");
  console.log(`User connected with session ID: ${socket.id}`);

  // TODO: FOR adding security to connect to socket

  // const token = socket.handshake.auth.token;
  // verifyToken(
  //   { headers: { authorization: `Bearer ${token}` } } as any,
  //   {} as any,
  //   async (err) => {
  //     if (err) {
  //       console.error("Error verifying token:", err);
  //       // Handle token verification failure
  //       socket.disconnect();
  //     } else {
  //       console.log("Token verified successfully");
  //       // Handle successful token verification
  //       // Attach event handlers for authenticated socket events
  //       handleCreateSocketEvent(socket);
  //       handleListAllTaskSocketEvent(socket);
  //       handleListOneTaskSocketEvent(socket);
  //       handleDeleteTaskSocketEvent(socket);
  //       handleUpdateTaskSocketEvent(socket);
  //     }
  //   }
  // );

  handleCreateSocketEvent(socket);
  handleListAllTaskSocketEvent(socket);
  handleListOneTaskSocketEvent(socket);
  handleDeleteTaskSocketEvent(socket);
  handleUpdateTaskSocketEvent(socket);

  // Handle disconnections from task namespace
  socket.on("disconnect", () => {
    console.log("User disconnected from task namespace");
  });
});

export default io;
