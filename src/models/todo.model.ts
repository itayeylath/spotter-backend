import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  userId: string; // Firebase UID
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // For faster queries by userId
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

// Index for faster queries
todoSchema.index({ userId: 1, createdAt: -1 });

export const Todo = mongoose.model<ITodo>("Todo", todoSchema);
