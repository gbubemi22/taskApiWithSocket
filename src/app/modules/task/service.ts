import { NotFoundError } from "../../utils/error.js";
import User from "../user/model.js";
import Task from "./model.js";
import { TaskDataType } from "./type.js";

export const createTask = async (userId: string, taskName: string) => {
  const user = await User.findById(userId);

  if (!user) throw new NotFoundError(`User not found`);

  const task = await Task.create({ userId, taskName });

  return {
    status: true,
    message: `Task Created`,
    data: task,
  };
};

export const listAllTask = async (userId: string) => {
  const tasks = await Task.find({ userId });
  if (!tasks || tasks.length === 0)
    throw new NotFoundError(`Task not found for this user`);

  return {
    status: true,
    message: `Fetched successfully`,
    count: tasks.length,
    data: tasks,
  };
};

export const listOneTask = async (taskId: string, userId: string) => {
  const task = await Task.findOne({ _id: taskId, userId: userId });

  if (!task) throw new NotFoundError(`Task not found for this user`);

  return {
    status: true,
    message: `Fetched successfully`,
    data: task,
  };
};

export const updateTask = async (
  taskId: string,
  userId: string,
  newData: any
) => {
  const task = await Task.findOne({ _id: taskId, userId: userId });

  if (!task) throw new NotFoundError(`Task not found`);

  task.set(newData);

  await task.save();
  return {
    status: true,
    message: `Updated Successfully`,
    data: task,
  };
};

export const deleteTask = async (taskId: string, userId: string) => {
  const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!deleteTask) throw new NotFoundError(`Task not found`);

  return {
    status: true,

    message: `Task Deleted successfully`,
    data: [],
  };
};
