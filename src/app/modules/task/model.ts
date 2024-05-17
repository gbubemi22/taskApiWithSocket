import mongoose from "mongoose";
import { TaskDocument } from "./type";

const TaskSchema = new mongoose.Schema<TaskDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    taskName: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "task",
    collation: {
      locale: "en",
      strength: 1,
      caseLevel: true,
      numericOrdering: true,
    },
  }
);

const Task = mongoose.model<TaskDocument>("task", TaskSchema);

export default Task;
