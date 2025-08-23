import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Task, User } from '../../interfaces';

@Injectable()
export class TasksService {
  constructor(@InjectModel('tasks') private taskModel: Model<any>) {}

  async deadlineCheck(userName: string): Promise<Task[] | undefined> {
    const hourAfter = new Date().setHours(new Date().getHours() + 1);

    return this.taskModel.find({
      deadline: { $lt: new Date(hourAfter) },
      notified: false,
      isDone: false,
      userNameTg: userName,
    });
  }

  async create(
    username: string,
    title: string,
    description: string,
    priority: number,
    deadline: any,
    notified: boolean,
  ) {
    const res = await axios.get(
      'http://localhost:3002/users/usernameExist/' + username,
    );
    if (!res.data) {
      await axios.post('http://localhost:3002/users/' + username);
    }
    const user = await axios.get<User>(
      'http://localhost:3002/users/username/' + username,
    );
    const userData = user.data;
    await axios.put<User>(
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      'http://localhost:3002/users/' + userData._id,
    );
    await this.taskModel.insertOne({
      title: title,
      notes: description,
      priority: priority,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      deadline: deadline,
      notified: notified,
      userNameTg: {
        _id: userData._id,
        username: username,
        countTasks: userData.countTasks + 1,
      },
    });
  }

  findAll() {
    return this.taskModel.find();
  }

  findOne(id: string) {
    return this.taskModel.findOne({ _id: id });
  }

  async findByUserId(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const countTaskBefore = await this.taskModel.findOne({ userNameTg: id });
    if (countTaskBefore) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const data: number = countTaskBefore?.countTasks;
      return this.taskModel.find({ userNameTg: id }).limit(data);
    } else {
      return 'Tasks not found';
    }
  }

  update(id: string, body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.taskModel.updateOne({ _id: id }, body);
  }

  async removeById(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const task = await this.taskModel.findOne({ _id: id });
    if (!task) {
      return 'Already deleted';
    }
    await this.taskModel.deleteOne({ _id: id });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return 'Task ' + task.title + 'deleted';
  }

  removeAll() {
    return this.taskModel.deleteMany();
  }
}
