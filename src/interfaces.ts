import { ObjectId } from 'mongodb';
import { Context } from 'telegraf';

export interface User {
  _id: ObjectId;
  username: string;
  role: string;
  countTasks: number;
}

export interface Task {
  _id: ObjectId;
  title: string;
  notes: string;
  priority: number;
  deadline: Date;
  notified: boolean;
  isDone: boolean;
  userNameTg: User;
}

export interface AddTask {
  message: string;
  next: string;
  save: (ctx: any, value: any) => any;
}

export interface MyContext extends Context {
  session?: {
    step: string;
    taskTitle: string;
    taskNotes: string;
    taskPriority: number;
    taskDeadline: Date;
    taskNotified: boolean;
    update: string;
    idTaskUpdate: string;
  };
}
