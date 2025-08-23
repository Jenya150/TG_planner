import mongoose from 'mongoose';

export const taskSchema = new mongoose.Schema({
  title: String,
  notes: String,
  priority: Number,
  deadline: Date,
  notified: Boolean,
  isDone: {
    type: Boolean,
    default: false,
  },
  userNameTg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
});

taskSchema.index({ deadline: 1, notified: 1 });
