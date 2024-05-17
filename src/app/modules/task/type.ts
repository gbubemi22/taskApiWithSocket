import mongoose from "mongoose";

export type TaskDocument = {
  userId: mongoose.Types.ObjectId;
  taskName: string;
  completed: boolean;
};

export type TaskDataType = {
  userId: mongoose.Types.ObjectId;
  taskName: string;
};
