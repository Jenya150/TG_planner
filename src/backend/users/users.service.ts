import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<any>) {}

  async doesUserExist(name: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.userModel.findOne({ userName: name });
    return user !== null;
  }

  async create(userName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.userModel.insertOne({
      userName: userName,
      role: 'user',
    });
  }

  findAll() {
    return this.userModel.find();
  }

  findOneById(id: string) {
    return this.userModel.findOne({ _id: new Types.ObjectId(id) });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ userName: username });
  }

  async TaskCountAdded(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const countTaskBefore = await this.userModel.findOne({ _id: id });
    if (countTaskBefore) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const data = countTaskBefore?.countTasks;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.userModel.findByIdAndUpdate(
        { _id: id },
        { countTasks: data + 1 },
        { new: true },
      );
    } else {
      return 'User not found';
    }
  }

  removeById(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }

  removeByUsername(username: string) {
    return this.userModel.deleteOne({ userName: username });
  }

  removeAll() {
    return this.userModel.deleteMany();
  }
}
