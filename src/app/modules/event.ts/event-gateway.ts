import { Socket } from "socket.io";
import {
  createTask,
  deleteTask,
  listAllTask,
  listOneTask,
  updateTask,
} from "../task/service.js";


export function handleCreateSocketEvent(socket: Socket) {
  socket.on("Create_Task", async (userId: string, taskName: string) => {
    try {
      const result = await createTask(userId, taskName);

      socket.emit("Created_Task", result);
    } catch (error) {
      console.error("Error handling handleCreateSocketEvent:", error);
    }
  });
}

export function handleListAllTaskSocketEvent(socket: Socket) {
  socket.on("Find_All_Tasks", async (userId: string) => {
    try {
      const result = await listAllTask(userId);

      socket.emit("Fetched_All", result);
    } catch (error) {
      console.error("Error handling handleListAllTaskSocketEvent:", error);
    }
  });
}

export function handleListOneTaskSocketEvent(socket: Socket) {
  socket.on("List_One", async (taskId: string, userId: string) => {
    try {
      const result = await listOneTask(taskId, userId);

      socket.emit("Fetched_One", result);
    } catch (error) {
      console.error("Error handling handleListOneTaskSocketEvent:", error);
    }
  });
}

export function handleDeleteTaskSocketEvent(socket: Socket) {
  socket.on("Delete_Task", async (taskId: string, userId: string) => {
    try {
      const result = await deleteTask(taskId, userId);

      socket.emit("Deleted_Task", result);
    } catch (error) {
      console.error("Error handling handleDeleteTaskSocketEvent:", error);
    }
  });
}

export function handleUpdateTaskSocketEvent(socket: Socket) {
  socket.on("Update_Task", async (taskId: string, userId: string, newData: any) => {
    try {
      const result = await updateTask(taskId, userId, newData);

      socket.emit("Updated_Task", result);
    } catch (error) {
      console.error("Error handling handleUpdateTaskSocketEvent:", error);
    }
  });
}
