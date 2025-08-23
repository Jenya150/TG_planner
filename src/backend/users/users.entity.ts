import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  role: String,
  countTasks: {
    type: Number,
    default: 0,
  },
});

export const userModel = mongoose.model('User', userSchema);
